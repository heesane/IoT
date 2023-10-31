import { getTopics } from './topicBase.js';
import mqtt from 'mqtt';
import { clientOption, mqttConn } from './config.js';

let client = mqtt.connect(mqttConn, clientOption);
let web_user = '$web';
let web_user_password = Math.random().toString(36).slice(2, 10);

client.on('connect', function () {
client.end();
})

let topic = getTopics('+');
let cmd = {
    'commands': [
        {
            'command': 'createRole',
            'rolename': '$web',
            'acls': [
                {
                    'acltype': 'subscribePattern',
                    'topic': topic.metaTopic,
                    'priority': -1,
                    'allow': true
                },
                {
                    'acltype': 'subscribePattern',
                    'topic': topic.evtTopic,
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
            'username': web_user,
            'password': web_user_password,
            'roles': [
                {
                    'rolename': web_user,
                    'priority': -1
                }
            ]
        }
    ]
}
client.publish('$CONTROL/dynamic-security/v1', JSON.stringify(cmd));
// mqtt options generation
console.log('let mqtt_options = {');
console.log(`    username: "${web_user}",`);
console.log(`    password: "${web_user_password}",`);
console.log('    clean: true,');
console.log('    rejectUnauthorized: false');
console.log('};');
console.log('export default mqtt_options;');
console.log("export let ws_protocol = 'ws://';");