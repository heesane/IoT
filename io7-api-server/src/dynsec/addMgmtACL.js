import mqtt from 'mqtt';
import { clientOption, mqttConn } from './config.js';
import { getMgmtTopic } from './topicBase.js';

let client = mqtt.connect(mqttConn, clientOption);

client.on('connect', function () {
    client.end();
})

let topic = getMgmtTopic();

let cmd = {
    'commands': [
        {
            'command': 'addRoleACL',
            'rolename': 'admin',
            'acltype': 'publishClientSend',
            'topic': topic.mgmtTopic,
            'priority': 0,
            'allow': true
        }
    ]
}
client.publish('$CONTROL/dynamic-security/v1', JSON.stringify(cmd));
console.log(`Adding mgmt ACL to $admin`);
