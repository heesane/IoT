import {readFileSync} from 'fs';
import { dynsec_json_file } from './config.js';

export let getDynSecClient = (appId) => {
    const data = readFileSync(dynsec_json_file, 'utf-8');
    let dynsec_json = JSON.parse(data);
    return dynsec_json.clients.filter(c => c.username == appId)[0];
}
