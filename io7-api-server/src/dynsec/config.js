import { admin_id, admin_pw } from './admin_id.js';

export let clientOption = {
    rejectUnauthorized: false,
    username: process.env.ADMIN_ID || admin_id,          // mqtt user id for the dynsec 
    password: process.env.ADMIN_PASSWORD || admin_pw, // mqtt password
};
export let mqttConn = process.env.MQTT_CONN || 'mqtt://127.0.0.1';

export let dynsec_json_file = process.env.DYNSEC_FILE || './mqtt/dynamic-security.json';