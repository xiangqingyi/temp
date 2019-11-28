var team_WeightingClass = require('../../class/team/WeightingClass');
var sys_optionsClass = require('../../class/sys/OptionsClass');
var ajaxResultClass = require('../../class/AjaxResultClass');
var renderObjClass = require('../../class/RenderObjClass');
var fsUtil = require('../../lib/FsUtil');
var commonUtil = require('../../lib/CommonUtil');

var muilter = require('../../lib/MulterUtil');

var weightingController = function () {};

//上傳檔案欄位名稱
var uploadFields = [{
    name: 'weighting_photo'
}];

/**
 * 帳號列表頁
 */
weightingController.entry = function (req, res, next) {
    "use strict";
    var renderObj = new renderObjClass();
    //選單
    commonUtil.setCurrentMenuActive(req.session.sys_userMenuList, 'team', 'weighting');
    renderObj.sidebarmenu.menuList = req.session.sys_userMenuList;

    var key = 'TeamWeighting';
    sys_optionsClass.getByKey(req.session.sessionUUID,key, function (err, optionsData) {
        var ajaxResult = new ajaxResultClass();
        if (err) {
            res.send(err);
        } else {
            renderObj.selectOptionsData = optionsData.content;
            res.render('pages/team/weighting', renderObj);
        }
    });
};

/**
 * 新增帳號頁面
 */
weightingController.entryAddPage = function (req, res) {
    "use strict";

    var renderObj = new renderObjClass();
    //選單
    commonUtil.setCurrentMenuActive(req.session.sys_userMenuList, 'team', 'weighting');
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

    res.render('pages/team/weighting_modify', renderObj);
};

/**
 * 新增帳號資料
 */
weightingController.addNewRow = function (req, res) {
    "use strict";

    var data = req.body.weighting;
    // //設定檔案上傳欄位
    // data = fsUtil.setSaveField(req,data);

    // team_WeightingClass.saveData(data,function(err){
    team_WeightingClass.saveDataFromAPI(req.session.sessionUUID, data, function (err) {
        if (err) {
            res.send(err);
        } else {
            res.redirect('/weighting');
        }
    });
};

/**
 * 編輯帳號頁面
 */
weightingController.entryEditPage = function (req, res) {
    var id = req.params.id;
    // team_WeightingClass.getId(id,function(err,weightingData){
    team_WeightingClass.getIdFromAPI(req.session.sessionUUID, id, function (err, weightingData) {
        if (err) {
            res.send(err);
        } else {
            if (!weightingData._id) {
                res.redirect('/');
            } else {

                var renderObj = new renderObjClass();
                //選單
                commonUtil.setCurrentMenuActive(req.session.sys_userMenuList, 'team', 'weighting');
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
                renderObj.pagestatus.params = weightingData;

                res.render('pages/team/weighting', renderObj);
                //res.json(weightingData);    
            }
        }
    });
};

/**
 * 編輯帳號資料
 */
weightingController.editOneRow = function (req, res) {
    var id = req.params.id;

    var data = req.body;

    // team_WeightingClass.update(id,req.body.weighting,function(err,data){
    team_WeightingClass.updateFromAPI(req.session.sessionUUID, id, req.body, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            res.redirect('/weighting');
        }
    });
};


weightingController.updateRow = function (req, res) {
    var id = req.params.id;

    var data = req.body;

    // console.log(data);


    // team_WeightingClass.update(id,req.body.weighting,function(err,data){
    team_WeightingClass.updateFromAPI(req.session.sessionUUID, id, req.body, function (err, data) {
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


/**
 * DataTables取列表資料
 */
weightingController.getDataTableList = function (req, res) {
    "use strict";
    // team_WeightingClass.getList(function(err,weightingData){

    var year = req.params.year;
    if (year == null || year == undefined) {
        year = new Date().getFullYear();
    }

    team_WeightingClass.getListFromAPI(req.session.sessionUUID, year, function (err, weightingData) {
        var ajaxResult = new ajaxResultClass();

        if (err) {
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.send(ajaxResult);
        } else {
            //console.log(JSON.stringify(weightingData));                                
            //ajaxResult.error = 0; 因回傳值需固定格式，所以不用ajaxResult回傳
            res.json(weightingData);
        }
    });
};

/**
 * DataTables刪除Row
 */
weightingController.DelDataTableRow = function (req, res) {
    var id = req.params.id;

    team_WeightingClass.removeFromAPI(req.session.sessionUUID, id, function (err) {
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

module.exports = weightingController;