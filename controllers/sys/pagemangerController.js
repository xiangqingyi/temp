var sys_pagemangerClass = require('../../class/sys/PagemangerClass');
var ajaxResultClass = require('../../class/AjaxResultClass');
var renderObjClass = require('../../class/RenderObjClass');
var fsUtil = require('../../lib/FsUtil');
var commonUtil = require('../../lib/CommonUtil');

var muilter = require('../../lib/MulterUtil');

var pagemangerController = function(){};

//上傳檔案欄位名稱
var uploadFields = [{
    name: 'pagemanger_photo'
}];

/**
 * 功能頁列表頁
 */
pagemangerController.entry = function(req, res, next){
    "use strict";

    var renderObj = new renderObjClass();
    //選單
    commonUtil.setCurrentMenuActive(req.session.sys_userMenuList,'management','pagemanger');
    renderObj.sidebarmenu.menuList = req.session.sys_userMenuList;

    res.render('pages/sys/pagemanger',renderObj);
};

/**
 * 新增功能頁頁面
 */
pagemangerController.entryAddPage = function(req,res){
    "use strict";

    var renderObj = new renderObjClass();
    //選單
    commonUtil.setCurrentMenuActive(req.session.sys_userMenuList,'management','pagemanger');
    renderObj.sidebarmenu.menuList = req.session.sys_userMenuList;
    //頁面內容
    renderObj.pageinfo.pageTitle = '新增功能頁管理';
    renderObj.pageinfo.titleDes = '新增資料';
    renderObj.pageinfo.tableTitle = '請輸入相關資料';
    renderObj.pageinfo.breadcrumb2ndTitle = '後台管理';
    renderObj.pageinfo.breadcrumb2ndhref = '#';
    renderObj.pageinfo.breadcrumb3rdTitle = '功能頁管理';
    renderObj.pageinfo.breadcrumb3rdhref = '#';
    //頁面狀態
    renderObj.pagestatus.type = 'add';
    renderObj.pagestatus.userID = req.session.sessionUserInfo.account;

    res.render('pages/sys/pagemanger_modify',renderObj);
};

/**
 * 新增功能頁單頭單身資料
 */
pagemangerController.addHeaderBodyRow = function(req,res){
    "use strict";
    
    var data = req.body;
    var privilegeArray = [];

    //組所屬權限資料
    if(typeof data.pagemanger_privilegesArray !== 'undefined'){
        data.pagemanger_privilegesArray.forEach(function(row){
            row.createDateTime = new Date();
            row.createUserId = req.session.sessionUserInfo.account;
            //server更新使用id非_id
            row.id = row._id;
            delete row._id;
            privilegeArray.push(row);
        });
    }

    //組整個pagemanger資料，新增日期，新增ID，Server端會記錄，可不傳。
    var pagemangerClass = {
        name: data.form.name,
        path: data.form.path,
        privilegeArray: privilegeArray
    };

    sys_pagemangerClass.saveHeadBodyDataFromAPI(req.session.sessionUUID,pagemangerClass,function(err){
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
 * 編輯功能頁頁面
 */
pagemangerController.entryEditPage = function(req,res){
    var id = req.params.id;
    // sys_pagemangerClass.getId(id,function(err,pagemangerData){
    sys_pagemangerClass.getIdFromAPI(req.session.sessionUUID,id,function(err,pagemangerData){
        if(err){
            res.send(err);
        }else{
            if(!pagemangerData._id){
                res.redirect('/');
            }else{

                var renderObj = new renderObjClass();
                //選單
                commonUtil.setCurrentMenuActive(req.session.sys_userMenuList,'management','pagemanger');
                renderObj.sidebarmenu.menuList = req.session.sys_userMenuList;
                //頁面內容
                renderObj.pageinfo.pageTitle = '編輯功能頁管理';
                renderObj.pageinfo.titleDes = '編輯資料';
                renderObj.pageinfo.tableTitle = '請編輯相關資料';
                renderObj.pageinfo.breadcrumb2ndTitle = '後台管理';
                renderObj.pageinfo.breadcrumb2ndhref = '#';
                renderObj.pageinfo.breadcrumb3rdTitle = '功能頁管理';
                renderObj.pageinfo.breadcrumb3rdhref = '#';
                //頁面狀態
                renderObj.pagestatus.type = 'edit';
                renderObj.pagestatus.userID = req.session.sessionUserInfo.account;
                renderObj.pagestatus.params = pagemangerData;
                
                res.render('pages/sys/pagemanger_modify',renderObj);
                //res.json(pagemangerData);    
            }            
        }
    });
};

/**
 * DataTables取列表資料
*/
pagemangerController.getDataTableList = function(req,res){
    "use strict";
    
    // sys_pagemangerClass.getList(function(err,pagemangerData){
    sys_pagemangerClass.getListFromAPI(req.session.sessionUUID,function(err,pagemangerData){
        var ajaxResult = new ajaxResultClass();

        if(err){
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.send(ajaxResult);
        }else{
            //console.log(JSON.stringify(pagemangerData));                                
            //ajaxResult.error = 0; 因回傳值需固定格式，所以不用ajaxResult回傳
            res.json(pagemangerData);
        }  
    });    
};

/**
 * 編輯功能頁單頭單身資料
 */
pagemangerController.editHeaderBodyRow = function(req,res){
    var id = req.params.id;

    var data = req.body;
    var privilegeArray = [];

    //組所屬權限資料
    if(typeof data.pagemanger_privilegesArray !== 'undefined'){
        data.pagemanger_privilegesArray.forEach(function(row){
            //server更新使用id非_id
            row.id = row._id;
            delete row._id;
            row.createDateTime = new Date();
            privilegeArray.push(row);
        });        
    }

    //組整個pagemanger資料，修改日期，修改ID，Server端會記錄，可不傳。
    var pagemangerClass = {
        name: data.form.name,
        path: data.form.path,
        privilegeArray: privilegeArray
    };

    sys_pagemangerClass.updateHeadBodyDataFromAPI(req.session.sessionUUID,id,pagemangerClass,function(err,data){
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
 * DataTables取編輯頁單身列表資料
*/
pagemangerController.getEditBodyDataTableList = function(req,res){
    "use strict";
    var id = req.params.id;
    
    // sys_pagemangerClass.getList(function(err,pagemangerData){
    sys_pagemangerClass.getIdBodyDataFromAPI(req.session.sessionUUID,id,function(err,pagemangerData){
        var ajaxResult = new ajaxResultClass();

        if(err){
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.send(ajaxResult);
        }else{
            //console.log(JSON.stringify(pagemangerData));                                
            //ajaxResult.error = 0; 因回傳值需固定格式，所以不用ajaxResult回傳
            res.json(pagemangerData);
        }  
    });    
};

/**
 * DataTables刪除Row
 */
pagemangerController.DelDataTableRow = function(req,res){
    var id = req.params.id;

    sys_pagemangerClass.removeFromAPI(req.session.sessionUUID,id,function(err){
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

module.exports = pagemangerController;