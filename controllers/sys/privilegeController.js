var sys_PrivilegeClass = require('../../class/sys/PrivilegeClass');
var ajaxResultClass = require('../../class/AjaxResultClass');
var renderObjClass = require('../../class/RenderObjClass');
var fsUtil = require('../../lib/FsUtil');
var commonUtil = require('../../lib/CommonUtil');

var muilter = require('../../lib/MulterUtil');

var privilegeController = function(){};

//上傳檔案欄位名稱
var uploadFields = [{
    name: 'privilege_photo'
}];

/**
 * 帳號列表頁
 */
privilegeController.entry = function(req, res, next){
    "use strict";

    var renderObj = new renderObjClass();
    //選單
    commonUtil.setCurrentMenuActive(req.session.sys_userMenuList,'management','privilege');
    renderObj.sidebarmenu.menuList = req.session.sys_userMenuList;

    res.render('pages/sys/privilege',renderObj);
};

/**
 * 新增帳號頁面
 */
privilegeController.entryAddPage = function(req,res){
    "use strict";

    var renderObj = new renderObjClass();
    //選單
    commonUtil.setCurrentMenuActive(req.session.sys_userMenuList,'management','privilege');
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

    res.render('pages/sys/privilege_modify',renderObj);
};

/**
 * 新增帳號資料
 */
privilegeController.addNewRow = function(req,res){
    "use strict";

    var data = req.body.privilege;
    // //設定檔案上傳欄位
    // data = fsUtil.setSaveField(req,data);

    // sys_PrivilegeClass.saveData(data,function(err){
    sys_PrivilegeClass.saveDataFromAPI(req.session.sessionUUID,data,function(err){
        if(err){
            res.send(err);
        }else{
            res.redirect('/privilege');
        }
    });
};

/**
 * 編輯帳號頁面
 */
privilegeController.entryEditPage = function(req,res){
    var id = req.params.id;
    // sys_PrivilegeClass.getId(id,function(err,privilegeData){
    sys_PrivilegeClass.getIdFromAPI(req.session.sessionUUID,id,function(err,privilegeData){
        if(err){
            res.send(err);
        }else{
            if(!privilegeData._id){
                res.redirect('/');
            }else{

                var renderObj = new renderObjClass();
                //選單
                commonUtil.setCurrentMenuActive(req.session.sys_userMenuList,'management','privilege');
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
                renderObj.pagestatus.params = privilegeData;
                
                res.render('pages/sys/privilege_modify',renderObj);
                //res.json(privilegeData);    
            }            
        }
    });
};

/**
 * 編輯帳號資料
 */
privilegeController.editOneRow = function(req,res){
    var id = req.params.id;
    // sys_PrivilegeClass.update(id,req.body.privilege,function(err,data){
    sys_PrivilegeClass.updateFromAPI(req.session.sessionUUID,id,req.body.privilege,function(err,data){
        if(err){
            res.send(err);
        }else{
            res.redirect('/privilege');
        }        
    });
};

/**
 * DataTables取列表資料
*/
privilegeController.getDataTableList = function(req,res){
    "use strict";
    
    // sys_PrivilegeClass.getList(function(err,privilegeData){
    sys_PrivilegeClass.getListFromAPI(req.session.sessionUUID,function(err,privilegeData){
        var ajaxResult = new ajaxResultClass();

        if(err){
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.send(ajaxResult);
        }else{
            //console.log(JSON.stringify(privilegeData));                                
            //ajaxResult.error = 0; 因回傳值需固定格式，所以不用ajaxResult回傳
            res.json(privilegeData);
        }  
    });    
};

/**
 * DataTables刪除Row
 */
privilegeController.DelDataTableRow = function(req,res){
    var id = req.params.id;

    sys_PrivilegeClass.removeFromAPI(req.session.sessionUUID,id,function(err){
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
 * 取得全部列表資料
*/
privilegeController.getWholeList = function(req,res){
    "use strict";
        
    sys_PrivilegeClass.getWholeListFromAPI(req.session.sessionUUID,function(err,privilegeData){
        var ajaxResult = new ajaxResultClass();

        if(err){
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.json(ajaxResult);
        }else{
            ajaxResult.error = 0;
            ajaxResult.data = privilegeData;
            res.json(ajaxResult);
        }  
    });    
};

module.exports = privilegeController;