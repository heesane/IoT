#!/bin/bash
#
# This script runs the post install procedure
# It should run after making sure the Docker engine is running
insecure=''
proto='http'
if [ -f ~/data/certs/iothub.crt ]
then
  insecure='--insecure'
  proto='https'
fi

function api_user_create {
	curl $insecure -X 'POST' $proto'://localhost:2009/signup' -H 'accept: application/json' \
	  -H 'Content-Type: application/json' \
	  -d '{
	  "id": "'$api_user_id'",
	  "realm": "io7",
	  "username": "API Server user",
	  "email": "'$api_user_email'",
	  "emailVerified": true,
	  "verificationToken": "string",
	  "password": "'$api_user_pw'",
	  "additionalProp1": {}
	}'
    return $?
}

if [ -f ~/data/io7-management-web/src/pages/mqtt_user.js ]
then
  echo "Do you want to reset the configuration? (n/y)"
  read reset
  if [ "$reset" != "y" ] && [ "$reset" != "Y" ]
  then
    echo Post Configuration Cancelled.
    exit
  else
    docker exec -it mqtt rm /mosquitto/config/dynamic-security.json
    if [ -d ~/data/io7-api-server/data ]
    then
      rm ~/data/io7-api-server/data/user.json
      rm ~/data/io7-api-server/data/devices.json
    else
      mkdir ~/data/io7-api-server/data
    fi
    rm ~/data/io7-api-server/src/dynsec/admin_id.js
    rm ~/data/io7-management-web/src/pages/mqtt_user.js
    echo Restarting io7api and mqtt. Wait for a few minutes.
    docker restart io7api
    docker restart mqtt
    echo io7api and mqtt restarted.
  fi
fi

cd ~
echo Enter the mqtt dynsec admin id
read admin_id
echo Enter the mqtt dynsec admin password
read admin_pw
echo Enter the API server user email address
read api_user_email
echo Enter the API server user password
read api_user_pw
docker exec -it mqtt mosquitto_ctrl dynsec init /mosquitto/config/dynamic-security.json $admin_id $admin_pw
echo "export let admin_id = '$admin_id';" > ~/data/io7-api-server/src/dynsec/admin_id.js
echo "export let admin_pw = '$admin_pw';" >> ~/data/io7-api-server/src/dynsec/admin_id.js
echo RESTARTING the API server and mosquitto server
docker restart io7api
docker restart mqtt
echo WAITING for the API server and mosquitto server to load
sleep 15
docker exec -it io7api node /home/node/app/src/dynsec/createAppRole.js
docker exec -it io7api node /home/node/app/src/dynsec/addMgmtACL.js
docker exec -it io7api node /home/node/app/src/dynsec/createWebUser.js > mqtt_user.js
mv mqtt_user.js ~/data/io7-management-web/src/pages
cd ~/data/io7-management-web && npm run build

# Web Admin id generation in the dynamic-security.json
api_user_id=$(echo $api_user_email | awk -F'@' '{ print $1 }')
api_user_create
if [ "$?" -eq "52" ]
then
    sleep 10
    api_user_create
    if [ "$?" -eq "52" ]
    then
        sleep 5
        api_user_create
    fi
fi

jwt=$(curl --insecure -X 'POST' $proto'://localhost:2009/users/login' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "'$api_user_email'",
  "password": "'$api_user_pw'"
}')
docker exec -it io7api node /home/node/app/src/dynsec/createGWAdmin.js $jwt > ~/data/gateway-server/serverOptions.json
echo All Done!! Happy IOT!!!
