#!/bin/bash
#
# This script installs the docker container images for the io7 Cloud Server
# It should run after making sure the Docker engine is running
dir=$(dirname $(echo $0))
docker build $dir -t mynode
branch=""
if [ "$1" != "" ]
then
    branch="-b $1"
fi

cp $dir/../docker-compose.yml ~
cp -R $dir/../data ~/
cp -R $dir/../gateway/server ~/data/gateway-server
if [ $(uname) = 'Linux' ]
then
    git clone $branch git@github.com:io7-dev/io7-management-web ~/data/io7-management-web
    git clone $branch git@github.com:io7-dev/io7-api-server.git ~/data/io7-api-server
else
    git clone $branch https://github.com/io7-dev/io7-management-web.git ~/data/io7-management-web
    git clone $branch https://github.com/io7-dev/io7-api-server.git ~/data/io7-api-server
fi

mkdir ~/data/io7-api-server/data

cd ~/data/nodered
npm i

cd ~/data/io7-api-server
npm i

cd ~/data/io7-management-web
npm i

cd ~/data/gateway-server
npm i

cd ~
docker-compose up -d