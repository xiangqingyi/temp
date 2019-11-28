var sys_RoleClass = require('../../class/sys/RoleClass');
var ajaxResultClass = require('../../class/AjaxResultClass');
var renderObjClass = require('../../class/RenderObjClass');
var fsUtil = require('../../lib/FsUtil');
var commonUtil = require('../../lib/CommonUtil');
var enumsUtil = require('../../lib/EnumsUtil');

var muilter = require('../../lib/MulterUtil');

var roleController = function () {};

//上傳檔案欄位名稱
var uploadFields = [{
    name: 'role_photo'
}];

/**
 * 角色列表頁
 */
roleController.entry = function (req, res, next) {
    "use strict";

    var renderObj = new renderObjClass();
    //選單
    commonUtil.setCurrentMenuActive(req.session.sys_userMenuList, 'management', 'role');
    renderObj.sidebarmenu.menuList = req.session.sys_userMenuList;

    res.render('pages/sys/role', renderObj);
};

/**
 * 新增角色頁面
 */
roleController.entryAddPage = function (req, res) {
    "use strict";

    var renderObj = new renderObjClass();
    //選單
    commonUtil.setCurrentMenuActive(req.session.sys_userMenuList, 'management', 'role');
    renderObj.sidebarmenu.menuList = req.session.sys_userMenuList;
    //頁面內容
    renderObj.pageinfo.pageTitle = '新增角色管理';
    renderObj.pageinfo.titleDes = '新增資料';
    renderObj.pageinfo.tableTitle = '請輸入相關資料';
    renderObj.pageinfo.breadcrumb2ndTitle = '後台管理';
    renderObj.pageinfo.breadcrumb2ndhref = '#';
    renderObj.pageinfo.breadcrumb3rdTitle = '角色管理';
    renderObj.pageinfo.breadcrumb3rdhref = '#';
    //頁面狀態
    renderObj.pagestatus.type = 'add';
    renderObj.pagestatus.userID = req.session.sessionUserInfo.account;
    renderObj.pagestatus.ROLE_HR_MANAGER = enumsUtil.ROLE.HR_MANAGER;

    res.render('pages/sys/role_modify', renderObj);
};

/**
 * 新增角色單頭單身資料
 */
roleController.addHeaderBodyRow = function (req, res) {
    "use strict";

    var data = req.body;
    var privilegeArray = [];

    //組所屬權限資料
    if (typeof data.role_privilegesArray !== 'undefined') {
        data.role_privilegesArray.forEach(function (row) {
            row.createDateTime = new Date();
            row.createUserId = req.session.sessionUserInfo.account;
            //server更新使用id非_id
            row.id = row._id;
            delete row._id;
            privilegeArray.push(row);
        });
    }

    //組整個Role資料，新增日期，新增ID，Server端會記錄，可不傳。
    var roleClass = {
        name: data.form.name,
        key: data.form.key,
        isHRmanager: data.form.isHRmanager,
        privilegeArray: privilegeArray
    };    

    sys_RoleClass.saveHeadBodyDataFromAPI(req.session.sessionUUID, roleClass, function (err) {
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
 * 編輯角色頁面
 */
roleController.entryEditPage = function (req, res) {
    var id = req.params.id;
    // sys_RoleClass.getId(id,function(err,roleData){
    sys_RoleClass.getIdFromAPI(req.session.sessionUUID, id, function (err, roleData) {
        if (err) {
            res.send(err);
        } else {
            if (!roleData._id) {
                res.redirect('/');
            } else {

                var renderObj = new renderObjClass();
                //選單
                commonUtil.setCurrentMenuActive(req.session.sys_userMenuList, 'management', 'role');
                renderObj.sidebarmenu.menuList = req.session.sys_userMenuList;
                //頁面內容
                renderObj.pageinfo.pageTitle = '編輯角色管理';
                renderObj.pageinfo.titleDes = '編輯資料';
                renderObj.pageinfo.tableTitle = '請編輯相關資料';
                renderObj.pageinfo.breadcrumb2ndTitle = '後台管理';
                renderObj.pageinfo.breadcrumb2ndhref = '#';
                renderObj.pageinfo.breadcrumb3rdTitle = '角色管理';
                renderObj.pageinfo.breadcrumb3rdhref = '#';
                //頁面狀態
                renderObj.pagestatus.type = 'edit';
                renderObj.pagestatus.userID = req.session.sessionUserInfo.account;
                renderObj.pagestatus.params = roleData;
                renderObj.pagestatus.ROLE_HR_MANAGER = enumsUtil.ROLE.HR_MANAGER;

                res.render('pages/sys/role_modify', renderObj);
                //res.json(roleData);    
            }
        }
    });
};

/**
 * DataTables取列表資料
 */
roleController.getDataTableList = function (req, res) {
    "use strict";

    // sys_RoleClass.getList(function(err,roleData){
    sys_RoleClass.getListFromAPI(req.session.sessionUUID, function (err, roleData) {
        var ajaxResult = new ajaxResultClass();

        if (err) {
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.send(ajaxResult);
        } else {
            //console.log(JSON.stringify(roleData));                                
            //ajaxResult.error = 0; 因回傳值需固定格式，所以不用ajaxResult回傳
            res.json(roleData);
        }
    });
};

/**
 * 編輯角色單頭單身資料
 */
roleController.editHeaderBodyRow = function (req, res) {
    var id = req.params.id;

    var data = req.body;
    var privilegeArray = [];

    //組所屬權限資料
    if (typeof data.role_privilegesArray !== 'undefined') {
        data.role_privilegesArray.forEach(function (row) {
            //server更新使用id非_id
            row.id = row._id;
            delete row._id;
            row.createDateTime = new Date();
            privilegeArray.push(row);
        });
    }

    //組整個Role資料，修改日期，修改ID，Server端會記錄，可不傳。
    var roleClass = {
        name: data.form.name,
        key: data.form.key,
        isHRmanager: data.form.isHRmanager,        
        privilegeArray: privilegeArray
    };

    sys_RoleClass.updateHeadBodyDataFromAPI(req.session.sessionUUID, id, roleClass, function (err, data) {
        var ajaxResult = new ajaxResultClass();

        if (err || err == false) {
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
 * DataTables取編輯頁單身列表資料
 */
roleController.getEditBodyDataTableList = function (req, res) {
    "use strict";
    var id = req.params.id;

    // sys_RoleClass.getList(function(err,roleData){
    sys_RoleClass.getIdBodyDataFromAPI(req.session.sessionUUID, id, function (err, roleData) {
        var ajaxResult = new ajaxResultClass();

        if (err) {
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.send(ajaxResult);
        } else {
            //console.log(JSON.stringify(roleData));                                
            //ajaxResult.error = 0; 因回傳值需固定格式，所以不用ajaxResult回傳
            res.json(roleData);
        }
    });
};

/**
 * DataTables刪除Row
 */
roleController.DelDataTableRow = function (req, res) {
    var id = req.params.id;

    sys_RoleClass.removeFromAPI(req.session.sessionUUID, id, function (err) {
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
 * 取得全部列表資料
 */
roleController.getWholeList = function (req, res) {
    "use strict";

    sys_RoleClass.getWholeListFromAPI(req.session.sessionUUID, function (err, roleData) {
        var ajaxResult = new ajaxResultClass();

        if (err) {
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.json(ajaxResult);
        } else {
            ajaxResult.error = 0;
            ajaxResult.data = roleData;
            res.json(ajaxResult);
        }
    });
};

module.exports = roleController;