const schedule = require('node-schedule');

const logUtil = require('../lib/loggerUtil');
const civetNotificationJob = require('./jobs/civetNotificationJob');

const jobs = [];

function createJob(jobid, jobtime, jobfn) {
    logUtil.info('%s 排程開始執行。%s', jobid, new Date());

    jobs[jobid] = schedule.scheduleJob(jobtime, jobfn);
}

function deleteJob(jobid) {
    jobs[jobid].cancel();
}

/**
 * 每個月26號早上九點發送通知
 */
// createJob('civetNotificationJob','*/15 * * * * *',civetNotificationJob.job);
createJob('civetNotificationJob', '0 9 26 * *', civetNotificationJob.job);