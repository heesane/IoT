import mqtt from 'mqtt';
import {clientOption, mqttConn} from './config.js';

export function mqttConnection() {
    let client = mqtt.connect(mqttConn, clientOption);

    client.on('connect', function () {
        client.subscribe('$CONTROL/dynamic-security/v1/response');
    })

    client.on('message', function (topic, message) {
        // message is Buffer
        console.log(topic + ' : ' + message.toString());
    });

    return client;
}