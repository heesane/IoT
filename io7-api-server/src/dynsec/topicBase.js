// This script is the adaption layer where you define all topic templates and
// generate the repective topics for the device to register.
// If you want a different topic structure, you can change this script.
//
const cmdBase       = 'iot3/+devId/cmd/+/fmt/+';
const evtBase       = 'iot3/+devId/evt/+/fmt/+';
const logBase       = 'iot3/+devId/mgmt/device/status';
const metaBase      = 'iot3/+devId/mgmt/device/meta';
const updateBase    = 'iot3/+devId/mgmt/device/update';
const rebootBase    = 'iot3/+devId/mgmt/initiate/device/reboot';
const resetBase     = 'iot3/+devId/mgmt/initiate/device/factory_reset';
const upgradeBase   = 'iot3/+devId/mgmt/initiate/firmware/update';
const gw_queryBase  = 'iot3/+devId/gateway/query';
const gw_addBase    = 'iot3/+devId/gateway/add';
const gw_listBase   = 'iot3/+devId/gateway/list';

export function getTopics(devId) {
    return {
        cmdTopic :    cmdBase.replace('+devId', devId),
        evtTopic :    evtBase.replace('+devId', devId),
        metaTopic :   metaBase.replace('+devId', devId),
        logTopic :    logBase.replace('+devId', devId),
        updateTopic : updateBase.replace('+devId', devId),
        rebootTopic : rebootBase.replace('+devId', devId),
        resetTopic :  resetBase.replace('+devId', devId),
        upgradeTopic :  upgradeBase.replace('+devId', devId),
        gw_query :  gw_queryBase.replace('+devId', devId),
        gw_add :  gw_addBase.replace('+devId', devId),
        gw_list :  gw_listBase.replace('+devId', devId),
        id : devId,
        rolename : devId 
    }
}

export function getMgmtTopic() {
    return {
        mgmtTopic : 'iot3/+/mgmt/#',
    }
}
export function getAppTopics() {
    return {
        subTopic : 'iot3/+/evt/#',
        pubTopic : 'iot3/+/cmd/#'
    }
}

export function getRoleName(devId) {
    console.log ( devId.replaceAll(':', '-' ));
    return ( devId );
}

export function checkDeviceArgs(args) {
    if (args.length < 3) {
        console.log('\n\tUsage : node ' + process.argv[1] + 'devType devId [pw]\n');
        return false;
    } else {
        return {
            id: args[2],
            pw: (args[3] == undefined ? (Math.random() + 1).toString(36).substring(2) : args[3])
        }
    }
}
export function getAppId(args) {
    return {
        appId: args[2],
        pw: (args[3] == undefined ? (Math.random() + 1).toString(36).substring(2) : args[3])
    }
}
