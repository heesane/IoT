import { getRoleName, getTopics } from './topicBase.js';
export { dynsec_json_file } from './config.js';

let client = global.mqtt_client;

export function createDevice(device, c = null) {
    if (c) {
        client = c;
        console.log(device);
    }
    let obj = getTopics(device.devId);
    let cmd = {
        'commands': [
            {
                'command': 'createRole',
                'rolename': obj.rolename,
                'acls': [
                    {
                        'acltype': 'subscribePattern',
                        'topic': obj.cmdTopic,
                        'priority': -1,
                        'allow': true
                    },
                    {
                        'acltype': 'subscribePattern',
                        'topic': obj.updateTopic,
                        'priority': -1,
                        'allow': true
                    },
                    {
                        'acltype': 'subscribePattern',
                        'topic': obj.rebootTopic,
                        'priority': -1,
                        'allow': true
                    },
                    {
                        'acltype': 'subscribePattern',
                        'topic': obj.resetTopic,
                        'priority': -1,
                        'allow': true
                    },
                    {
                        'acltype': 'subscribePattern',
                        'topic': obj.upgradeTopic,
                        'priority': -1,
                        'allow': true
                    },
                    {
                        'acltype': 'publishClientSend',
                        'topic': obj.logTopic,
                        'priority': -1,
                        'allow': true
                    },
                    {
                        'acltype': 'publishClientSend',
                        'topic': obj.metaTopic,
                        'priority': -1,
                        'allow': true
                    },
                    {
                        'acltype': 'publishClientSend',
                        'topic': obj.evtTopic,
                        'priority': -1,
                        'allow': true
                    }
                ]
            }
        ]
    }
    if (device.type === 'gateway') {
        cmd.commands[0].acls.push({
            'acltype': 'publishClientSend',
            'topic': obj.gw_query,
            'priority': -1,
            'allow': true
        });
        cmd.commands[0].acls.push({
            'acltype': 'publishClientSend',
            'topic': obj.gw_add,
            'priority': -1,
            'allow': true
        });
        cmd.commands[0].acls.push({
            'acltype': 'subscribePattern',
            'topic': obj.gw_list,
            'priority': -1,
            'allow': true
        });
    }
    client.publish('$CONTROL/dynamic-security/v1', JSON.stringify(cmd));

    if (device.type === 'edge'){
        cmd = {
            'commands': [
                {
                    'command': 'addClientRole',
                    'username': device.createdBy,
                    'rolename': device.devId
                }
            ]
        }
        console.log(`Creating Edge Client "${obj.id}".`);
    } else {
        cmd = {
            'commands': [
                {
                    'command': 'createClient',
                    'username': obj.id,
                    'password': device.password,
                    'roles': [
                        {
                            'rolename': obj.rolename,
                            'priority': -1
                        }
                    ]
                }
            ]
        }
        console.log(`Creating Client "${obj.id}".`);
    }
    client.publish('$CONTROL/dynamic-security/v1', JSON.stringify(cmd));
}

export function deleteRole(id) {
    if (id !== 'admin') {
	    let cmd = {
	        'commands': [
	            {
	                'command': 'deleteRole',
	                'rolename': getRoleName(id)
	            }
	        ]
	    }
	    client.publish('$CONTROL/dynamic-security/v1', JSON.stringify(cmd));
    }
    console.log(`Deleting Role "${id}".`);
}

export function deleteDevice(id) {
    let cmd = {
        'commands': [
            {
                'command': 'deleteClient',
                'username': id
            }
        ]
    }
    client.publish('$CONTROL/dynamic-security/v1', JSON.stringify(cmd));
    console.log(`Deleting Device "${id}".`);
}
