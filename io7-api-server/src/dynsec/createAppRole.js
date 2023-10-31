import { getAppTopics } from './topicBase.js';
import mqtt from 'mqtt';
import { clientOption, mqttConn } from './config.js';

let client = mqtt.connect(mqttConn, clientOption);

client.on('connect', function () {
    client.end();
})

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
console.log('Default App Role "$apps" created');
