var team_MonthScoreClass = require('../../class/team/MonthScoreClass');
var team_memberClass = require('../../class/team/MemberClass');
var ajaxResultClass = require('../../class/AjaxResultClass');
var renderObjClass = require('../../class/RenderObjClass');
var fsUtil = require('../../lib/FsUtil');
var enumsUtil = require('../../lib/EnumsUtil');
var commonUtil = require('../../lib/CommonUtil');

var muilter = require('../../lib/MulterUtil');

var monthScoreController = function () { };

//上傳檔案欄位名稱
var uploadFields = [{
    name: 'monthScore_photo'
}];

/**
 * 帳號列表頁
 */
monthScoreController.entry = function (req, res, next) {
    "use strict";

    var renderObj = new renderObjClass();
    //選單
    commonUtil.setCurrentMenuActive(req.session.sys_userMenuList, 'team', 'monthscore');
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
        renderObj.pagestatus.teams = teams;
        renderObj.data = {
            year: scoreYear,
            month: scoreMonth
        };
        res.render('pages/team/monthscore', renderObj);
    });
};

/**
 * 新增帳號頁面
 */
monthScoreController.entryAddPage = function (req, res) {
    "use strict";

    var renderObj = new renderObjClass();
    //選單
    commonUtil.setCurrentMenuActive(req.session.sys_userMenuList, 'team', 'monthscore');
    renderObj.sidebarmenu.menuList = req.session.sys_userMenuList;
    //頁面內容
    renderObj.pageinfo.pageTitle = '新增權限管理';
    renderObj.pageinfo.titleDes = '新增資料';
    renderObj.pageinfo.tableTitle = '請輸入相關資料';
    renderObj.pageinfo.breadcrumb2ndTitle = '後台管理';
    renderObj.pageinfo.breadcrumb2ndhref = '#';
    renderObj.pageinfo.breadcrumb3rdTitle = '權限管理';
    renderObj.pageinfo.breadcrumb3rdhref = '#';
    //頁面狀態
    renderObj.pagestatus.type = 'add';

    res.render('pages/team/monthscore_modify', renderObj);
};

/**
 * 新增帳號資料
 */
monthScoreController.addNewRow = function (req, res) {
    "use strict";

    var data = req.body.monthScore;
    // //設定檔案上傳欄位
    // data = fsUtil.setSaveField(req,data);

    // team_MonthScoreClass.saveData(data,function(err){
    team_MonthScoreClass.saveDataFromAPI(req.session.sessionUUID, data, function (err) {
        if (err) {
            res.send(err);
        } else {
            res.redirect('/monthscore');
        }
    });
};

/**
 * 新增單身資料
 */
monthScoreController.addBodyRow = function (req, res) {
    "use strict";
    var data = req.body;
    //存入資料處理
    var monthScoreClass = [];
    data.monthScoreArray.forEach(function (row) {
        row.version = parseInt(row.version) + 1;
        //server新增刪除id非_id
        delete row._id;
        delete row.createUserId;
        delete row.createDateTime;
        //存檔時，提交狀態改為false
        row.leaderSubmit = false;
        monthScoreClass.push(row);
    });

    team_MonthScoreClass.saveBodyDataFromAPI(req.session.sessionUUID, monthScoreClass, function (err) {
        var ajaxResult = new ajaxResultClass();

        if (err) {
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


/**
 * 提交單身資料
 */
monthScoreController.submitBodyRow = function (req, res) {
    "use strict";
    var teamId = req.params.teamId;

    var data = req.body;
    //存入資料處理，存放ID陣列
    //["58bfa2b141524e7936e5812e", "58bfa2b141524e7936e58176"]
    var monthScoreClass = data.monthScoreArray;

    team_MonthScoreClass.submitBodyDataFromAPI(req.session.sessionUUID, teamId, monthScoreClass, function (err, data) {
        var ajaxResult = new ajaxResultClass();

        if (err) {
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

/**
 * 編輯帳號頁面
 */
monthScoreController.entryEditPage = function (req, res) {
    var id = req.params.id;
    // team_MonthScoreClass.getId(id,function(err,monthScoreData){
    team_MonthScoreClass.getIdFromAPI(req.session.sessionUUID, id, function (err, monthScoreData) {
        if (err) {
            res.send(err);
        } else {
            if (!monthScoreData._id) {
                res.redirect('/');
            } else {

                var renderObj = new renderObjClass();
                //選單
                commonUtil.setCurrentMenuActive(req.session.sys_userMenuList, 'team', 'monthscore');
                renderObj.sidebarmenu.menuList = req.session.sys_userMenuList;
                //頁面內容
                renderObj.pageinfo.pageTitle = '編輯權限管理';
                renderObj.pageinfo.titleDes = '編輯資料';
                renderObj.pageinfo.tableTitle = '請編輯相關資料';
                renderObj.pageinfo.breadcrumb2ndTitle = '後台管理';
                renderObj.pageinfo.breadcrumb2ndhref = '#';
                renderObj.pageinfo.breadcrumb3rdTitle = '權限管理';
                renderObj.pageinfo.breadcrumb3rdhref = '#';
                //頁面狀態
                renderObj.pagestatus.type = 'edit';
                renderObj.pagestatus.params = monthScoreData;

                res.render('pages/team/monthscore_modify', renderObj);
                //res.json(monthScoreData);
            }
        }
    });
};

/**
 * 編輯帳號資料
 */
monthScoreController.editOneRow = function (req, res) {
    var id = req.params.id;
    // team_MonthScoreClass.update(id,req.body.monthScore,function(err,data){
    team_MonthScoreClass.updateFromAPI(req.session.sessionUUID, id, req.body.monthScore, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            res.redirect('/monthscore');
        }
    });
};

/**
 * DataTables取列表資料
 */
monthScoreController.getDataTableList = function (req, res) {
    "use strict";
    var teamId = req.params.teamId;

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

    var ajaxResult = new ajaxResultClass();
    //取得年月    
    var year = scoreYear;
    var month = scoreMonth;

    //取得團隊分數資料
    team_MonthScoreClass.getSearchListFromAPI(req.session.sessionUUID, year, month, teamId, function (err, monthScoreData) {
        // console.log(monthScoreData);
        if (err) {
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.send(ajaxResult);
        } else {
            //console.log(JSON.stringify(monthScoreData));
            if (monthScoreData.data.length != 0) {
                //ajaxResult.error = 0; 因回傳值需固定格式，所以不用ajaxResult回傳
                monthScoreData.isHRmanager = req.session.sessionUserInfo.isHRmanager || 0;
                res.json(monthScoreData);
            } else {
                //無當月資料，取得團隊訊息
                team_memberClass.getIdFromAPI(req.session.sessionUUID, teamId, function (err, memberData) {
                    if (err) {
                        ajaxResult.error = 1;
                        ajaxResult.message = err;
                        res.send(ajaxResult);
                    } else {
                        var rankPoint = JSON.parse(req.session.sys_optionsData[enumsUtil.OPTIONS.RankPercent].content);
                        var memberResult = [];
                        var teamMemberCount = memberData.members.length;
                        memberData.members.forEach(function (row) {
                            var temp = new team_MonthScoreClass(row);
                            //editor需要傳DT_RowId識別ID
                            temp.DT_RowId = temp._id;
                            //設定預設值
                            temp.teamId = teamId;
                            temp.memberId = row.id;
                            temp.memberName = row.userName;
                            temp.memberScoreRank = 4;
                            temp.memberScoreRank_display = rankPoint[rankPoint.length - 1].name;
                            temp.year = year;
                            temp.month = month;
                            temp.teamMemberCount = teamMemberCount;
                            temp.createUserId = req.session.sessionUserInfo.account;
                            memberResult.push(temp);
                        });

                        var result = {
                            data: memberResult,
                            isHRmanager: req.session.sessionUserInfo.isHRmanager || 0,
                        };
                        res.json(result);
                    }
                });
            }
        }
    });
};

/**
 * DataTables刪除Row
 */
monthScoreController.DelDataTableRow = function (req, res) {
    var id = req.params.id;

    team_MonthScoreClass.removeFromAPI(req.session.sessionUUID, id, function (err) {
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

module.exports = monthScoreController;