var team_MonthScoreSummaryClass = require('../../class/team/MonthScoreSummaryClass');
const team_MonthScoreClass = require('../../class/team/MonthScoreClass');
var ajaxResultClass = require('../../class/AjaxResultClass');
var renderObjClass = require('../../class/RenderObjClass');
var fsUtil = require('../../lib/FsUtil');
var sysConfig = require('../../configs/sys.config');
var commonUtil = require('../../lib/CommonUtil');
const logUtil = require('../../lib/loggerUtil');

var muilter = require('../../lib/MulterUtil');
var request = require('request');

var monthScoreSummaryController = function () { };

//上傳檔案欄位名稱
var uploadFields = [{
    name: 'monthScoreSummary_photo'
}];

/**
 * 帳號列表頁
 */
monthScoreSummaryController.entry = function (req, res, next) {
    "use strict";
    var renderObj = new renderObjClass();
    //選單
    commonUtil.setCurrentMenuActive(req.session.sys_userMenuList, 'team', 'monthscoresummary');
    renderObj.sidebarmenu.menuList = req.session.sys_userMenuList;

    //現在日期
    var dt = new Date();
    var thisYear = dt.getFullYear();
    var thisMonth = dt.getMonth() + 1;
    //參數日期
    var scoreYear = (typeof req.params.year !== "undefined") ? req.params.year : thisYear;
    var scoreMonth = (typeof req.params.month !== "undefined") ? req.params.month : thisMonth;
    //判斷日期是否合法
    if (scoreYear > thisYear || ((scoreYear == thisYear) && (scoreMonth > thisMonth))) {
        scoreYear = thisYear;
        scoreMonth = thisMonth;
    }

    renderObj.data = {
        year: scoreYear,
        month: scoreMonth
    };

    res.render('pages/team/monthScoreSummary', renderObj);
};

/**
 * DataTables取列表資料
 */
monthScoreSummaryController.getDataTableList = function (req, res) {
    "use strict";
    // team_WeightingClass.getList(function(err,weightingData){

    //現在日期
    var dt = new Date();
    var thisYear = dt.getFullYear();
    var thisMonth = dt.getMonth() + 1;
    //參數日期
    var scoreYear = (typeof req.params.year !== "undefined") ? req.params.year : thisYear;
    var scoreMonth = (typeof req.params.month !== "undefined") ? req.params.month : thisMonth;
    //判斷日期是否合法
    if (scoreYear > thisYear || ((scoreYear == thisYear) && (scoreMonth > thisMonth))) {
        scoreYear = thisYear;
        scoreMonth = thisMonth;
    }

    team_MonthScoreSummaryClass.getListFromAPI(req.session.sessionUUID, scoreYear, scoreMonth, function (err, monthScoreSummaryData) {
        var ajaxResult = new ajaxResultClass();

        if (err) {
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.send(ajaxResult);
        } else {
            //console.log(JSON.stringify(weightingData));                                
            //ajaxResult.error = 0; 因回傳值需固定格式，所以不用ajaxResult回傳
            res.json(monthScoreSummaryData);
        }
    });
};

//主管確認
monthScoreSummaryController.managerConfirm = function (req, res) {
    "use strict";
    // team_WeightingClass.getList(function(err,weightingData){
    team_MonthScoreSummaryClass.managerConfirm(req.session.sessionUUID, req.body.noManagerConfirmList, function (err, data) {
        var ajaxResult = new ajaxResultClass();

        if (err) {
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.json(ajaxResult);
        } else {
            ajaxResult.error = 0;
            res.json(ajaxResult);
        }
    });
};

//主管提醒
monthScoreSummaryController.alert = function (req, res) {
    "use strict";
    // team_WeightingClass.getList(function(err,weightingData){

    var teamIds = [];
    if (typeof req.body.noDataList !== 'undefined') {
        req.body.noDataList.forEach(function (row) {
            //server更新使用id非_id
            // row.createDateTime = new Date();
            teamIds.push(row.teamId);
        });
    }

    team_MonthScoreSummaryClass.alert(req.session.sessionUUID, teamIds, function (err, data) {
        //香信生活頻道通知
        logUtil.info('手動提醒開始。%s', new Date());
        team_MonthScoreClass.sendNotificationToCivet(req.session.sessionUUID, function (isSuccess, failList) {
            var ajaxResult = new ajaxResultClass();
            if (isSuccess == true) {
                logUtil.info('手動提醒完成。%s', new Date());
                ajaxResult.error = 0;
                res.json(ajaxResult);
            } else {
                var failStr = '提醒失敗人員：';
                failList.forEach(function (row) {
                    failStr += row.account + ' ' + row.userName + ' ';
                });

                logUtil.error('手動通提醒失敗人員：%j,%s', failList, new Date());
                ajaxResult.error = 1;
                ajaxResult.message = failStr;
                res.json(ajaxResult);
            }
        });
    });
};

/**
 * 主管退回
 */
monthScoreSummaryController.managerReject = function (req, res) {
    "use strict";
    var teamid = req.params.id;

    team_MonthScoreSummaryClass.managerReject(req.session.sessionUUID, teamid, function (err, data) {
        var ajaxResult = new ajaxResultClass();

        if (err || err == false) {
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.json(ajaxResult);
            return;
        } else {
            ajaxResult.error = 0;
            ajaxResult.message = '';
            res.json(ajaxResult);
            return;
        }
    });
};

//成員通知
monthScoreSummaryController.memberNotify = function (req, res) {
    "use strict";
    var teamIds = [];
    var scoreMonth = req.body.scoremonth;
    if (typeof req.body.teamid !== 'undefined') {
        teamIds = req.body.teamid;
    }

    //香信生活頻道通知
    logUtil.info('手動通知成員開始。%s', new Date());
    team_MonthScoreClass.sendMemberNotificationToCivet(req.session.sessionUUID, teamIds, scoreMonth, function (isSuccess, failList) {
        var ajaxResult = new ajaxResultClass();
        if (isSuccess == true) {
            logUtil.info('手動通知成員完成。%s', new Date());
            ajaxResult.error = 0;
            res.json(ajaxResult);
        } else {
            var failStr = '通知失敗人員：';
            failList.forEach(function (row) {
                failStr += row.account + ' ' + row.userName + ' ';
            });

            logUtil.error('手動通知失敗人員：%j,%s', failList, new Date());
            ajaxResult.error = 1;
            ajaxResult.message = failStr;
            res.json(ajaxResult);
        }
    });
};

//匯出excel
monthScoreSummaryController.exportexcel = function (req, res) {
    "use strict";
    //現在日期
    var dt = new Date();
    var thisYear = dt.getFullYear();
    var thisMonth = dt.getMonth() + 1;
    //參數日期
    var scoreYear = (typeof req.params.year !== "undefined") ? req.params.year : thisYear;
    var scoreMonth = (typeof req.params.month !== "undefined") ? req.params.month : thisMonth;
    console.log("/" + scoreYear + "/" + scoreMonth);
    request(sysConfig.API.host + sysConfig.API.url.monthscore.exportExcel + "/" + scoreYear + "/" + scoreMonth).pipe(res);
};



module.exports = monthScoreSummaryController;