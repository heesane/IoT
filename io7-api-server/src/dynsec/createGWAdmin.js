import { getTopics } from './topicBase.js';
import mqtt from 'mqtt';
import { clientOption, mqttConn } from './config.js';

let client = mqtt.connect(mqttConn, clientOption);
let gw_adm = '$gw_adm';
let gw_adm_password = Math.random().toString(36).slice(2, 10);

client.on('connect', function () {
client.end();
})

let token;
if (process.argv.length > 2) {
    token = JSON.parse(process.argv[2]).token || '';
}

let topic = getTopics('+');
let cmd = {
    'commands': [
        {
            'command': 'createRole',
            'rolename': '$gw_adm',
            'acls': [
                {
                    'acltype': 'subscribePattern',
                    'topic': topic.gw_add,
                    'priority': -1,
                    'allow': true
                },
                {
                    'acltype': 'subscribePattern',
                    'topic': topic.gw_query,
                    'priority': -1,
                    'allow': true
                },
                {
                    'acltype': 'publishClientSend',
                    'topic': topic.gw_list,
                    'priority': -1,
                    'allow': true
                }
            ]
        }
    ]
}
client.publish('$CONTROL/dynamic-security/v1', JSON.stringify(cmd));
cmd = {
    'commands': [
        {
            'command': 'createClient',
            'username': gw_adm,
            'password': gw_adm_password,
            'roles': [
                {
                    'rolename': gw_adm,
                    'priority': -1
                }
            ]
        }
    ]
}
client.publish('$CONTROL/dynamic-security/v1', JSON.stringify(cmd));
// mqtt options generation
let config = {
    token : token,
    serverOptions : {
        username: gw_adm,
        password: gw_adm_password,
        clean: true,
        rejectUnauthorized: false
    }
}
console.log(JSON.stringify(config, null, 4));