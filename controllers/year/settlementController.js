var year_SettlementClass = require('../../class/year/SettlementClass');
var ajaxResultClass = require('../../class/AjaxResultClass');
var renderObjClass = require('../../class/RenderObjClass');
var fsUtil = require('../../lib/FsUtil');
var commonUtil = require('../../lib/CommonUtil');

var muilter = require('../../lib/MulterUtil');

var settlementController = function(){};

//上傳檔案欄位名稱
var uploadFields = [{
    name: 'privilege_photo'
}];

/**
 * 帳號列表頁
 */
settlementController.entry = function(req, res, next){
    "use strict";

    var renderObj = new renderObjClass();
    //選單
    commonUtil.setCurrentMenuActive(req.session.sys_userMenuList,'year','yearsettlement');
    renderObj.sidebarmenu.menuList = req.session.sys_userMenuList;

    res.render('pages/year/settlement',renderObj);
};

/**
 * 新增帳號頁面
 */
settlementController.entryAddPage = function(req,res){
    "use strict";

    var renderObj = new renderObjClass();
    //選單
    commonUtil.setCurrentMenuActive(req.session.sys_userMenuList,'year','yearsettlement');
    renderObj.sidebarmenu.menuList = req.session.sys_userMenuList;
    //頁面內容
    renderObj.pageinfo.pageTitle = '新增年度結算';
    renderObj.pageinfo.titleDes = '新增資料';
    renderObj.pageinfo.tableTitle = '請輸入相關資料';
    renderObj.pageinfo.breadcrumb2ndTitle = '年度結算';
    renderObj.pageinfo.breadcrumb2ndhref = '#';
    renderObj.pageinfo.breadcrumb3rdTitle = '年度結算';
    renderObj.pageinfo.breadcrumb3rdhref = '#';
    //頁面狀態
    renderObj.pagestatus.type = 'add';

    res.render('pages/year/settlement_modify',renderObj);
};

/**
 * 編輯帳號頁面
 */
settlementController.entryEditPage = function(req,res){
    var id = req.params.id;
    year_SettlementClass.getIdFromAPI(req.session.sessionUUID,id,function(err,resultData){
        if(err){
            res.send(err);
        }else{
            if(!resultData._id){
                res.redirect('/');
            }else{

                var renderObj = new renderObjClass();
                //選單
                commonUtil.setCurrentMenuActive(req.session.sys_userMenuList,'year','yearsettlement');
                renderObj.sidebarmenu.menuList = req.session.sys_userMenuList;
                //頁面內容
                renderObj.pageinfo.pageTitle = '編輯年度結算';
                renderObj.pageinfo.titleDes = '編輯資料';
                renderObj.pageinfo.tableTitle = '請編輯相關資料';
                renderObj.pageinfo.breadcrumb2ndTitle = '年度結算';
                renderObj.pageinfo.breadcrumb2ndhref = '#';
                renderObj.pageinfo.breadcrumb3rdTitle = '年度結算';
                renderObj.pageinfo.breadcrumb3rdhref = '#';
                //頁面狀態
                renderObj.pagestatus.type = 'edit';
                renderObj.pagestatus.params = resultData;
                renderObj.pagestatus.params.id = id;

                res.render('pages/year/settlement_modify',renderObj);
            }
        }
    });
};

/**
 * 編輯帳號資料
 */
settlementController.editOneRow = function(req,res){
    "use strict";
    var id = req.params.id;

    year_SettlementClass.updateFromAPI(req.session.sessionUUID,id,req.body,function(err){
        var ajaxResult = new ajaxResultClass();
        if(err){
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.json(ajaxResult);
        }else{
            ajaxResult.error = 0;
            res.json(ajaxResult);
        }
    });
};

/**
 * DataTables取列表資料
*/
settlementController.getDataTableList = function(req,res){
    "use strict";
    
    // year_SettlementClass.getList(function(err,privilegeData){
    year_SettlementClass.getListFromAPI(req.session.sessionUUID,function(err,resultData){
        var ajaxResult = new ajaxResultClass();

        if(err){
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.send(ajaxResult);
        }else{
            //console.log(JSON.stringify(privilegeData));                                
            //ajaxResult.error = 0; 因回傳值需固定格式，所以不用ajaxResult回傳
            res.json(resultData);
        }  
    });    
};

module.exports = settlementController;