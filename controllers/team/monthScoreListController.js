var team_MonthScoreListClass = require('../../class/team/MonthScoreListClass');
var ajaxResultClass = require('../../class/AjaxResultClass');
var renderObjClass = require('../../class/RenderObjClass');
var fsUtil = require('../../lib/FsUtil');
var commonUtil = require('../../lib/CommonUtil');
var logUtil = require('../../lib/loggerUtil');

var muilter = require('../../lib/MulterUtil');

var monthScoreListController = function () { };

//上傳檔案欄位名稱
var uploadFields = [{
    name: 'monthScore_photo'
}];

/**
 * 帳號列表頁
 */
monthScoreListController.entry = function (req, res, next) {
    "use strict";

    var renderObj = new renderObjClass();
    //選單
    commonUtil.setCurrentMenuActive(req.session.sys_userMenuList, 'team', 'monthscorelist');
    renderObj.sidebarmenu.menuList = req.session.sys_userMenuList;

    //現在日期
    var dt = new Date();
    var thisYear = dt.getFullYear();
    var thisMonth = dt.getMonth() + 1;
    //參數日期
    var scoreYear = (typeof req.params.year !== "undefined") ? req.params.year : 9999;
    var scoreMonth = (typeof req.params.month !== "undefined") ? req.params.month : 99;
    //判斷日期是否合法
    if (scoreYear > thisYear || ((scoreYear == thisYear) && (scoreMonth > thisMonth))) {
        scoreYear = '';
        scoreMonth = '';
    }
    //目前團隊
    var selectedTeamId = (typeof req.params.teamid !== "undefined") ? req.params.teamid : '';
    

    try {
        team_MonthScoreListClass.getScoreInfoFromAPI(req.session.sessionUUID, selectedTeamId, scoreYear, scoreMonth, function (err, monthScoreData) {
            var ajaxResult = new ajaxResultClass();

            // 取得teamid
            var teams = [];
            console.log(monthScoreData);
            if (typeof monthScoreData !== 'undefined') {
                if (monthScoreData.teamArray !== null) {
                    monthScoreData.teamArray.forEach(function (row) {
                        teams.push({
                            id: row.teamId,
                            name: row.teamName
                        });
                    });
                }
            }

            renderObj.pagestatus.selectedTeamId = (selectedTeamId || '');
            renderObj.pagestatus.teams = teams;

            if (err) {
                renderObj.data = null;
                res.send(err);
            } else {
                renderObj.data = monthScoreData;
                res.render('pages/team/monthscorelist', renderObj);
            }
        });

    } catch (tryError) {
        logUtil.error('monthScoreListController.entry error:%s', tryError);
        renderObj.data = null;
        res.send(tryError);
    }
};

/**
 * 新增帳號頁面
 */
monthScoreListController.entryAddPage = function (req, res) {
    "use strict";

    var renderObj = new renderObjClass();
    //選單
    commonUtil.setCurrentMenuActive(req.session.sys_userMenuList, 'team', 'monthscorelist');
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
monthScoreListController.addNewRow = function (req, res) {
    "use strict";

    var data = req.body.monthScore;
    // //設定檔案上傳欄位
    // data = fsUtil.setSaveField(req,data);

    // team_MonthScoreListClass.saveData(data,function(err){
    team_MonthScoreListClass.saveDataFromAPI(req.session.sessionUUID, data, function (err) {
        if (err) {
            res.send(err);
        } else {
            res.redirect('/monthscorelist');
        }
    });
};

/**
 * 編輯帳號頁面
 */
monthScoreListController.entryEditPage = function (req, res) {
    var id = req.params.id;
    // team_MonthScoreListClass.getId(id,function(err,monthScoreData){
    team_MonthScoreListClass.getIdFromAPI(req.session.sessionUUID, id, function (err, monthScoreListData) {
        if (err) {
            res.send(err);
        } else {
            if (!monthScoreListData._id) {
                res.redirect('/');
            } else {

                var renderObj = new renderObjClass();
                //選單
                commonUtil.setCurrentMenuActive(req.session.sys_userMenuList, 'team', 'monthscorelist');
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
                renderObj.pagestatus.params = monthScoreListData;

                res.render('pages/team/monthscore_modify', renderObj);
                //res.json(monthScoreData);
            }
        }
    });
};

/**
 * 編輯帳號資料
 */
monthScoreListController.editOneRow = function (req, res) {
    var id = req.params.id;
    // team_MonthScoreListClass.update(id,req.body.monthScore,function(err,data){
    team_MonthScoreListClass.updateFromAPI(req.session.sessionUUID, id, req.body.monthScore, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            res.redirect('/monthscorelist');
        }
    });
};

/**
 * DataTables取列表資料
 */
monthScoreListController.getDataTableList = function (req, res) {
    "use strict";

    // team_MonthScoreListClass.getList(function(err,monthScoreData){
    team_MonthScoreListClass.getListFromAPI(req.session.sessionUUID, function (err, monthScoreListData) {
        var ajaxResult = new ajaxResultClass();

        //console.log(monthScoreListData);
        if (err) {
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.send(ajaxResult);
        } else {
            //console.log(JSON.stringify(monthScoreData));
            //ajaxResult.error = 0; 因回傳值需固定格式，所以不用ajaxResult回傳
            res.json(monthScoreListData);
        }
    });
};

/**
 * DataTables取列表資料
 */
monthScoreListController.getScoreInfo = function (req, res) {
    "use strict";

    // team_MonthScoreListClass.getList(function(err,monthScoreData){
    team_MonthScoreListClass.getScoreInfoFromAPI(req.session.sessionUUID, function (err, monthScoreListData) {
        var ajaxResult = new ajaxResultClass();

        //console.log(monthScoreListData);
        if (err) {
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.send(ajaxResult);
        } else {
            //console.log(JSON.stringify(monthScoreData));
            //ajaxResult.error = 0; 因回傳值需固定格式，所以不用ajaxResult回傳
            res.json(monthScoreListData);
        }
    });
};

/**
 * DataTables刪除Row
 */
monthScoreListController.DelDataTableRow = function (req, res) {
    var id = req.params.id;

    team_MonthScoreListClass.removeFromAPI(req.session.sessionUUID, id, function (err) {
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

module.exports = monthScoreListController;