import mqtt from 'mqtt';
import fetch from 'node-fetch';
import fs from 'fs';
import https from 'https';
import http from 'http';

const configFile = fs.readFileSync('./serverOptions.json', 'utf8');
const cfg = JSON.parse(configFile);
const token = cfg.token;
const serverOptions = cfg.serverOptions;

const api_server = process.env.API_SERVER || 'http://localhost:2009';
const secure_api = api_server.split(':')[0] === 'https';
let agent;
if (secure_api) {
    agent = new https.Agent({
        rejectUnauthorized: false,
        keepAlive: true
    });
} else {
    agent = new http.Agent({
        keepAlive: true
    });
}

const cloud = mqtt.connect(process.env.MQTT_CONN || 'mqtt://localhost', serverOptions);
const apiServer = process.env.API_SERVER || 'http://localhost:2009';

let processAdd = (gw, message) => {
    // api call to add device
    // publish the device id in this form ['newly added device'] 
    let msg;
    try { msg = JSON.parse(message.toString()); } catch (e) {}
    const edgeDevice = {
        "devId": msg.d.devId,
        "type": "edge",
        "createdBy": gw,
        "password": ""
    }

    fetch(apiServer + '/devices',
        {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + token
            },
            body: JSON.stringify(edgeDevice),
            agent
        })
        .then((response) => {
            if (response.status === 200) {
            } else if (response.status === 409) {
                console.log(`the device "${edgeDevice.devId}" exists.`);
                return [];
            } else {
                console.log(`the device "${edgeDevice.devId}" can't be added. HTTP Error(${response.status}).`);
                return [];
            }
        });

}

async function pubDeviceList(gw, message) {
    let msg;
    try { msg = JSON.parse(message.toString()); } catch (e) {}
    const response = await fetch(apiServer + '/devices/' + gw, {
        method: 'get',
        headers: {
            "Content-Type": "application/json",
            "Authorization": 'Bearer ' + token
        },
        agent
    });

    const data = await response.json();
    let list = [];
    data.roles.forEach( d => {
        list.push(d['rolename'])
    });
    cloud.publish(`iot3/${gw}/gateway/list`, JSON.stringify(list));
    return data;
}

cloud.on('connect', function () {
    cloud.subscribe('iot3/+/gateway/add');
    cloud.subscribe('iot3/+/gateway/query');
});

cloud.on('message', function (topic, message) {
    const topic_ = topic.split('/');
    if (topic_[3] === 'add') {
        processAdd(topic_[1], message);
    } else if (topic_[3] === 'query') {
        pubDeviceList(topic_[1], message);
    }
});

