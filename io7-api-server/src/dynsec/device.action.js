let client = global.mqtt_client;

export function rebootDevice(device) {
    let cmd = {};
    client.publish(`iot3/${device}/mgmt/initiate/device/reboot`, JSON.stringify(cmd));
    console.log(`Rebooting device "${device}".`);
}

export function resetDevice(device) {
    let cmd = {};
    client.publish(`iot3/${device}/mgmt/initiate/device/factory_reset`, JSON.stringify(cmd));
    console.log(`Rebooting device "${device}".`);
}

export function updateDevice(device, meta) {
    let data = {
        d: {
            fields: [
                {
                    field: "metadata",
                    value: {...meta.metadata}
                }
            ]
        }
    }
    client.publish(`iot3/${device}/mgmt/device/update`, JSON.stringify(data));
    console.log(`Updating metadata "${device}".`);
}

export function upgradeDevice(device, fw_url) {
    let data = {
        d: {
            upgrade: {
                ...fw_url
            }
        }
    }

    client.publish(`iot3/${device}/mgmt/initiate/firmware/update`, JSON.stringify(data));
    console.log(`Upgrading ${device} with "${fw_url.fw_url}".`);
}