export { dynsec_json_file } from './config.js';

let client = global.mqtt_client;

export function createAppId(appIdObj) {
    let cmd = {
        'commands': [
            {
                'command': 'createClient',
                'username': appIdObj.appId,
                'password': appIdObj.password,
                'roles': [
                    {
                        'rolename': '$apps',
                        'priority': -1
                    }
                ]

            }
        ]
    }
    client.publish('$CONTROL/dynamic-security/v1', JSON.stringify(cmd));
    console.log(`App ID "${appIdObj.appId}" created`);
}


export function deleteAppId(appId) {
    let cmd = {
        'commands': [
            {
                'command': 'deleteClient',
                'username': appId
            }
        ]
    }
    client.publish('$CONTROL/dynamic-security/v1', JSON.stringify(cmd));
    console.log(`App ID "${appId}" deleted.`);
}
