var sys_optionsClass = require('../../class/sys/OptionsClass');
var ajaxResultClass = require('../../class/AjaxResultClass');
var renderObjClass = require('../../class/RenderObjClass');
var fsUtil = require('../../lib/FsUtil');
var commonUtil = require('../../lib/CommonUtil');

var muilter = require('../../lib/MulterUtil');

var optionsController = function(){};

//上傳檔案欄位名稱
var uploadFields = [{
    name: 'options_photo'
}];

/**
 * 系統參數列表頁
 */
optionsController.entry = function(req, res, next){
    "use strict";

    var renderObj = new renderObjClass();
    //選單
    commonUtil.setCurrentMenuActive(req.session.sys_userMenuList,'management','options');
    renderObj.sidebarmenu.menuList = req.session.sys_userMenuList;

    res.render('pages/sys/options',renderObj);
};

/**
 * 新增系統參數頁面
 */
optionsController.entryAddPage = function(req,res){
    "use strict";

    var renderObj = new renderObjClass();
    //選單
    commonUtil.setCurrentMenuActive(req.session.sys_userMenuList,'management','options');
    renderObj.sidebarmenu.menuList = req.session.sys_userMenuList;
    //頁面內容
    renderObj.pageinfo.pageTitle = '新增系統參數管理';
    renderObj.pageinfo.titleDes = '新增資料';
    renderObj.pageinfo.tableTitle = '請輸入相關資料';
    renderObj.pageinfo.breadcrumb2ndTitle = '後台管理';
    renderObj.pageinfo.breadcrumb2ndhref = '#';
    renderObj.pageinfo.breadcrumb3rdTitle = '系統參數管理';
    renderObj.pageinfo.breadcrumb3rdhref = '#';
    //頁面狀態
    renderObj.pagestatus.type = 'add';
    renderObj.pagestatus.userID = req.session.sessionUserInfo.account;

    res.render('pages/sys/options_modify',renderObj);
};

/**
 * 新增系統參數單頭單身資料
 */
optionsController.addHeaderBodyRow = function(req,res){
    "use strict";
    
    var data = req.body;

    //組整個options資料，新增日期，新增ID，Server端會記錄，可不傳。
    var optionsClass = {
        name: data.form.name,
        key: data.form.key,
        content: data.form.content,
        description: data.form.description
    };

    sys_optionsClass.saveHeadBodyDataFromAPI(req.session.sessionUUID,optionsClass,function(err){
        var ajaxResult = new ajaxResultClass();
        
        if(err){
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.json(ajaxResult);
            return;
        }else{
            ajaxResult.error = 0;
            ajaxResult.message = '';
            res.json(ajaxResult);            
            return;
        }
    });
};

/**
 * 編輯系統參數頁面
 */
optionsController.entryEditPage = function(req,res){
    var id = req.params.id;
    // sys_optionsClass.getId(id,function(err,optionsData){
    sys_optionsClass.getIdFromAPI(req.session.sessionUUID,id,function(err,optionsData){
        if(err){
            res.send(err);
        }else{
            if(!optionsData._id){
                res.redirect('/');
            }else{

                var renderObj = new renderObjClass();
                //選單
                commonUtil.setCurrentMenuActive(req.session.sys_userMenuList,'management','options');
                renderObj.sidebarmenu.menuList = req.session.sys_userMenuList;
                //頁面內容
                renderObj.pageinfo.pageTitle = '編輯系統參數管理';
                renderObj.pageinfo.titleDes = '編輯資料';
                renderObj.pageinfo.tableTitle = '請編輯相關資料';
                renderObj.pageinfo.breadcrumb2ndTitle = '後台管理';
                renderObj.pageinfo.breadcrumb2ndhref = '#';
                renderObj.pageinfo.breadcrumb3rdTitle = '系統參數管理';
                renderObj.pageinfo.breadcrumb3rdhref = '#';
                //頁面狀態
                renderObj.pagestatus.type = 'edit';
                renderObj.pagestatus.userID = req.session.sessionUserInfo.account;
                renderObj.pagestatus.params = optionsData;
                
                res.render('pages/sys/options_modify',renderObj);
                //res.json(optionsData);    
            }            
        }
    });
};

/**
 * DataTables取列表資料
*/
optionsController.getDataTableList = function(req,res){
    "use strict";
    
    // sys_optionsClass.getList(function(err,optionsData){
    sys_optionsClass.getListFromAPI(req.session.sessionUUID,function(err,optionsData){
        var ajaxResult = new ajaxResultClass();

        if(err){
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.send(ajaxResult);
        }else{
            //console.log(JSON.stringify(optionsData));                                
            //ajaxResult.error = 0; 因回傳值需固定格式，所以不用ajaxResult回傳
            res.json(optionsData);
        }  
    });    
};

/**
 * 編輯系統參數單頭單身資料
 */
optionsController.editHeaderBodyRow = function(req,res){
    var id = req.params.id;

    var data = req.body;

    //組整個options資料，修改日期，修改ID，Server端會記錄，可不傳。
    var optionsClass = {
        name: data.form.name,
        key: data.form.key,
        content: data.form.content,
        description: data.form.description
    };

    sys_optionsClass.updateHeadBodyDataFromAPI(req.session.sessionUUID,id,optionsClass,function(err,data){
        var ajaxResult = new ajaxResultClass();
        
        if(err || err==false){
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.json(ajaxResult);
            return;
        }else{
            ajaxResult.error = 0;
            ajaxResult.message = '';
            res.json(ajaxResult);            
            return;
        }
    });
};


/**
 * DataTables刪除Row
 */
optionsController.DelDataTableRow = function(req,res){
    var id = req.params.id;

    sys_optionsClass.removeFromAPI(req.session.sessionUUID,id,function(err){
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
 * getByKey
 */
optionsController.getByKey = function(req,res){
    var key = req.params.key;
    sys_optionsClass.getByKey(req.session.sessionUUID,key,function(err,optionsData){
        var ajaxResult = new ajaxResultClass();
        if(err){
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.send(optionsData);
        }else{
            //console.log(JSON.stringify(weightingData));
            //ajaxResult.error = 0; 因回傳值需固定格式，所以不用ajaxResult回傳
            res.json(optionsData);
        }
    });
};

module.exports = optionsController;