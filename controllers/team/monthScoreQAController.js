var team_MonthScoreQAClass = require('../../class/team/MonthScoreQAClass');
var ajaxResultClass = require('../../class/AjaxResultClass');
var renderObjClass = require('../../class/RenderObjClass');
var fsUtil = require('../../lib/FsUtil');
var commonUtil = require('../../lib/CommonUtil');

var muilter = require('../../lib/MulterUtil');

var monthScoreQAController = function () {};

//上傳檔案欄位名稱
var uploadFields = [{
    name: 'monthScore_photo'
}];

/**
 * 帳號列表頁
 */
monthScoreQAController.entry = function (req, res, next) {
    "use strict";

    var renderObj = new renderObjClass();
    //選單
    commonUtil.setCurrentMenuActive(req.session.sys_userMenuList, 'team', 'monthscoreqa');
    renderObj.sidebarmenu.menuList = req.session.sys_userMenuList;
    res.render('pages/team/monthscoreqa', renderObj);
};

/**
 * 新增帳號頁面
 */
monthScoreQAController.entryAddPage = function (req, res) {
    "use strict";

    var renderObj = new renderObjClass();
    //選單
    commonUtil.setCurrentMenuActive(req.session.sys_userMenuList, 'team', 'monthscoreqa');
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
monthScoreQAController.addNewRow = function (req, res) {
    "use strict";

    var data = req.body.monthScore;
    // //設定檔案上傳欄位
    // data = fsUtil.setSaveField(req,data);

    // team_MonthScoreQAClass.saveData(data,function(err){
    team_MonthScoreQAClass.saveDataFromAPI(req.session.sessionUUID, data, function (err) {
        if (err) {
            res.send(err);
        } else {
            res.redirect('/monthscoreqa');
        }
    });
};

/**
 * 編輯帳號頁面
 */
monthScoreQAController.entryEditPage = function (req, res) {
    var id = req.params.id;
    // team_MonthScoreQAClass.getId(id,function(err,monthScoreData){
    team_MonthScoreQAClass.getIdFromAPI(req.session.sessionUUID,id, function (err, monthScoreQAData) {
        if (err) {
            res.send(err);
        } else {
            if (!monthScoreQAData._id) {
                res.redirect('/');
            } else {

                var renderObj = new renderObjClass();
                //選單
                commonUtil.setCurrentMenuActive(req.session.sys_userMenuList, 'team', 'monthscoreqa');
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
                renderObj.pagestatus.params = monthScoreQAData;

                res.render('pages/team/monthscore_modify', renderObj);
                //res.json(monthScoreData);
            }
        }
    });
};

/**
 * 編輯帳號資料
 */
monthScoreQAController.editOneRow = function (req, res) {
    var id = req.params.id;
    // team_MonthScoreQAClass.update(id,req.body.monthScore,function(err,data){
    team_MonthScoreQAClass.updateFromAPI(req.session.sessionUUID,id, req.body.monthScore, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            res.redirect('/monthscoreqa');
        }
    });
};

/**
 * DataTables取列表資料
 */
monthScoreQAController.getDataTableList = function (req, res) {
    "use strict";

    // team_MonthScoreQAClass.getList(function(err,monthScoreData){
    team_MonthScoreQAClass.getListFromAPI(req.session.sessionUUID,function (err, monthScoreQAData) {
        var ajaxResult = new ajaxResultClass();

        //console.log(monthScoreQAData);
        if (err) {
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.send(ajaxResult);
        } else {
            //console.log(JSON.stringify(monthScoreData));
            //ajaxResult.error = 0; 因回傳值需固定格式，所以不用ajaxResult回傳
            res.json(monthScoreQAData);
        }
    });
};

/**
 * DataTables刪除Row
 */
monthScoreQAController.DelDataTableRow = function (req, res) {
    var id = req.params.id;

    team_MonthScoreQAClass.removeFromAPI(req.session.sessionUUID,id, function (err) {
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

module.exports = monthScoreQAController;