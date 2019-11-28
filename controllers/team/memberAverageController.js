var team_memberAverageClass = require('../../class/team/MemberAverageClass');
var team_memberClass = require('../../class/team/MemberClass');

var ajaxResultClass = require('../../class/AjaxResultClass');
var renderObjClass = require('../../class/RenderObjClass');
var fsUtil = require('../../lib/FsUtil');
var enumsUtil = require('../../lib/EnumsUtil');
var commonUtil = require('../../lib/CommonUtil');

var memberAverageController = function () { };

//上傳檔案欄位名稱
var uploadFields = [{
    name: 'member_photo'
}];

memberAverageController.list = function (req, res, next) {
    "use strict";

    var renderObj = new renderObjClass();
    //選單
    commonUtil.setCurrentMenuActive(req.session.sys_userMenuList, 'team', 'memberaverage');
    renderObj.sidebarmenu.menuList = req.session.sys_userMenuList;

    //取得系統參數
    renderObj.pagestatus.rankPoint = req.session.sys_optionsData[enumsUtil.OPTIONS.RankPercent].content;

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

    //取得teamId
    team_memberClass.getTeamIdByLeaderAccountFromAPI(req.session.sessionUUID, req.session.sessionUserInfo.account, function (err, membersArry) {
        var teams = [];
        if (typeof membersArry !== 'undefined' && membersArry.length > 0) {
            membersArry.forEach(function (row) {
                teams.push({
                    id: row._id,
                    name: row.name
                });
            });
        } else {
            teams.push({
                id: '',
                name: ''
            });
        }

        var selectedTeamId = (typeof req.params.teamid !== "undefined") ? req.params.teamid : teams[0].id;
        renderObj.pagestatus.selectedTeamId = selectedTeamId;
        renderObj.pagestatus.teams = teams || '';
        renderObj.data = {
            year: scoreYear,
            month: scoreMonth
        };

        res.render('pages/team/memberAveragetotallist', renderObj);
    });

};

memberAverageController.getListData = function (req, res) {
    "use strict";

    var range = req.params.range;
    var start = req.params.start;
    var end = req.params.end;

    var accounts = req.body.accounts;
    var teams = req.body.teams;

    if (range == 'year') {

    } else if (range == 'month') {
        var sArray = start.split('-');
        var eArray = end.split('-');
        start = parseInt(sArray[0], 10) * 100 + parseInt(sArray[1], 10);
        end = parseInt(eArray[0], 10) * 100 + parseInt(eArray[1], 10);
    } else if (range == 'season') {
        var sArray = start.split('-');
        var eArray = end.split('-');
        start = parseInt(sArray[0], 10) * 10 + Math.floor(parseInt(sArray[1], 10) / 4) + 1;
        end = parseInt(eArray[0], 10) * 10 + Math.floor(parseInt(eArray[1], 10) / 4) + 1;
    }

    team_memberAverageClass.getListDataFromAPI(req.session.sessionUUID, range, start, end, accounts, teams, function (err, weightingData) {
        var ajaxResult = new ajaxResultClass();

        if (err) {
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.send(ajaxResult);
        } else {
            //console.log(JSON.stringify(weightingData));
            //ajaxResult.error = 0; 因回傳值需固定格式，所以不用ajaxResult回傳                        
            weightingData.data.data.forEach(function (row, index) {
                var tempSumavgScore = 0;
                if (row.data != null) {
                    for (var key in row.data) {
                        weightingData.data.data[index].data[key].avgScore_display = row.data[key].avgScore;
                        tempSumavgScore += row.data[key].avgScore;
                    }
                    //計算統計
                    var totalMonth = Object.keys(row.data).length;  //有成績的月份     
                    weightingData.data.data[index].data.totalavgScore = tempSumavgScore / totalMonth;   //平均有成績的月份
                } else {
                    weightingData.data.data[index].data = {};
                    weightingData.data.data[index].data.totalavgScore = 0;
                }
            });

            //增加統計欄位
            var totalavgScoreColumn = {
                data: {
                    display: "data.totalavgScore",
                    sort: "data.totalavgScore",
                    _: "data.totalavgScore"
                },
                error: 0
            };
            weightingData.data.columns.push(totalavgScoreColumn);

            res.json(weightingData);
        }
    });
};

module.exports = memberAverageController;