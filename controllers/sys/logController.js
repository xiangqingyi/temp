var sys_LogClass = require('../../class/sys/LogClass');
var ajaxResultClass = require('../../class/AjaxResultClass');
var renderObjClass = require('../../class/RenderObjClass');
var fsUtil = require('../../lib/FsUtil');
var commonUtil = require('../../lib/CommonUtil');

var muilter = require('../../lib/MulterUtil');

var logController = function(){};

//上傳檔案欄位名稱
var uploadFields = [{
    name: 'log_photo'
}];

/**
 * 帳號列表頁
 */
logController.entry = function(req, res, next){
    "use strict";

    var renderObj = new renderObjClass();
    //選單
	commonUtil.setCurrentMenuActive(req.session.sys_userMenuList,'management','log');
    renderObj.sidebarmenu.menuList = req.session.sys_userMenuList;
	
    res.render('pages/sys/log',renderObj);
};

/**
 * 新增帳號頁面
 */
logController.entryAddPage = function(req,res){
    "use strict";

    var renderObj = new renderObjClass();
    //選單
	commonUtil.setCurrentMenuActive(req.session.sys_userMenuList,'management','log');
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

    res.render('pages/sys/log_modify',renderObj);
};

/**
 * 新增帳號資料
 */
logController.addNewRow = function(req,res){
    "use strict";

    var data = req.body.log;
    // //設定檔案上傳欄位
    // data = fsUtil.setSaveField(req,data);

    // sys_LogClass.saveData(data,function(err){
    sys_LogClass.saveDataFromAPI(req.session.sessionUUID,data,function(err){
        if(err){
            res.send(err);
        }else{
            res.redirect('/log');
        }
    });
};

/**
 * 編輯帳號頁面
 */
logController.entryEditPage = function(req,res){
    var id = req.params.id;
    // sys_LogClass.getId(id,function(err,logData){
    sys_LogClass.getIdFromAPI(req.session.sessionUUID,id,function(err,logData){
        if(err){
            res.send(err);
        }else{
            if(!logData._id){
                res.redirect('/');
            }else{

                var renderObj = new renderObjClass();
                //選單
				commonUtil.setCurrentMenuActive(req.session.sys_userMenuList,'management','log');
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
                renderObj.pagestatus.params = logData;
                
                res.render('pages/sys/log_modify',renderObj);
                //res.json(logData);    
            }            
        }
    });
};

/**
 * 編輯帳號資料
 */
logController.editOneRow = function(req,res){
    var id = req.params.id;
    // sys_LogClass.update(id,req.body.log,function(err,data){
    sys_LogClass.updateFromAPI(req.session.sessionUUID,id,req.body.log,function(err,data){
        if(err){
            res.send(err);
        }else{
            res.redirect('/log');
        }        
    });
};

/**
 * DataTables取列表資料
*/
logController.getDataTableList = function(req,res){
    "use strict";
    var size = req.query.length;
    var page = req.query.start / size;
    var draw = req.query.draw;

    var columnsInfo = req.query.columns;
    var orderInfo = req.query.order;

    var quertString = req.query.search.value;

    var columnName = columnsInfo[orderInfo[0].column].data;
    var dir = orderInfo[0].dir;
    var sort = columnName + "," + dir;

    // sys_LogClass.getList(function(err,logData){
    sys_LogClass.getListFromAPI(req.session.sessionUUID,size,page,draw,sort,quertString,function(err,logData){
        var ajaxResult = new ajaxResultClass();

        if(err){
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.send(ajaxResult);
        }else{
            //console.log(JSON.stringify(logData));
            //ajaxResult.error = 0; 因回傳值需固定格式，所以不用ajaxResult回傳
            res.json(logData);
        }  
    });    
};

/**
 * DataTables刪除Row
 */
logController.DelDataTableRow = function(req,res){
    var id = req.params.id;

    sys_LogClass.removeFromAPI(req.session.sessionUUID,id,function(err){
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

module.exports = logController;