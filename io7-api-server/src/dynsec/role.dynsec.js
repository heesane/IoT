import { getAppTopics } from './topicBase.js';
export { dynsec_json_file } from './config.js';

let client = global.mqtt_client;

export function createRole(role) {
    let id = role.roleId;
    let cmd = {
        'commands': [
            {
                'command': 'createRole',
                'rolename': id,
                'acls': [
                ]
            }
        ]
    }
    client.publish('$CONTROL/dynamic-security/v1', JSON.stringify(cmd));
    console.log(`Creating Role ${id}.`);
}

export function createAppRole(role) {
    let id = '$apps';
    let topic = getAppTopics();
    let cmd = {
        'commands': [
            {
                'command': 'createRole',
                'rolename': id,
                'acls': [
                    {
                        'acltype': 'subscribePattern',
                        'topic': topic.subTopic,
                        'priority': -1,
                        'allow': true
                    },
                    {
                        'acltype': 'publishClientSend',
                        'topic': topic.pubTopic,
                        'priority': -1,
                        'allow': true
                    }
                ]
            }
        ]
    }
    client.publish('$CONTROL/dynamic-security/v1', JSON.stringify(cmd));
    console.log('Creating Default App Role "$apps".');
}

export function assign(deviceRole) {
    let cmd = {
        "commands": [
            {
                "command": "addClientRole",
                "username": deviceRole.devId,
                "rolename": deviceRole.roleId,
                "priority": -1
            }
        ]
    }
    client.publish('$CONTROL/dynamic-security/v1', JSON.stringify(cmd));
    console.log(`Assigning Role "${deviceRole.roleId}" to device/app ${deviceRole.devId}.`);
}

export function revoke(deviceRole) {
    let cmd = {
        "commands": [
            {
                "command": "removeClientRole",
                "username": deviceRole.devId,
                "rolename": deviceRole.roleId 
            }
        ]
    }
    client.publish('$CONTROL/dynamic-security/v1', JSON.stringify(cmd));
    console.log(`Revoking Role "${deviceRole.roleId}" from device/app ${deviceRole.devId}.`);
}

export function deleteRole(roleId) {
    let id = roleId;
    if (id != 'admin' && id != '$apps') {
        let cmd = {
            'commands': [
                {
                    'command': 'deleteRole',
                    'rolename': id
                }
            ]
        }
        client.publish('$CONTROL/dynamic-security/v1', JSON.stringify(cmd));
    }
    console.log(`Role "${id}" deleted.`);
}
