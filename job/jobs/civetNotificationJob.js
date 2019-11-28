const uuidV1 = require('uuid/v1');

const logUtil = require('../../lib/loggerUtil');
const team_MonthScoreClass = require('../../class/team/MonthScoreClass');

const uuid = uuidV1();

/**
 * CivetNotificationJob
 */
exports.job = () => {
    logUtil.info('排程提醒開始。%s', new Date());

    team_MonthScoreClass.sendNotificationToCivet(uuid, function (isSuccess, failList) {
        if (isSuccess == true) {
            logUtil.info('排程提醒完成。%s', new Date());
        } else {
            logUtil.info('排程提醒完成，失敗人員：%j %s', failList, new Date());
        }
    });
};