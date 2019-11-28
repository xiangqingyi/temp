var sys_AccountClass = require('../../class/sys/AccountClass');
var ajaxResultClass = require('../../class/AjaxResultClass');
var renderObjClass = require('../../class/RenderObjClass');
var fsUtil = require('../../lib/FsUtil');
var commonUtil = require('../../lib/CommonUtil');
var enumsUtil = require('../../lib/EnumsUtil');

var muilter = require('../../lib/MulterUtil');

var accountController = function () { };

//上傳檔案欄位名稱
var uploadFields = [{
    name: 'account_photo'
}];

/**
 * 帳號列表頁
 */
accountController.entry = function (req, res, next) {
    "use strict";

    var renderObj = new renderObjClass();

    //選單
    commonUtil.setCurrentMenuActive(req.session.sys_userMenuList, 'management', 'account');
    renderObj.sidebarmenu.menuList = req.session.sys_userMenuList;

    res.render('pages/sys/account', renderObj);
};

/**
 * 新增帳號頁面
 */
accountController.entryAddPage = function (req, res) {
    "use strict";

    var renderObj = new renderObjClass();
    //選單
    commonUtil.setCurrentMenuActive(req.session.sys_userMenuList, 'management', 'account');
    renderObj.sidebarmenu.menuList = req.session.sys_userMenuList;
    //頁面內容
    renderObj.pageinfo.pageTitle = '新增使用者管理';
    renderObj.pageinfo.titleDes = '新增資料';
    renderObj.pageinfo.tableTitle = '請輸入相關資料';
    renderObj.pageinfo.breadcrumb2ndTitle = '後台管理';
    renderObj.pageinfo.breadcrumb2ndhref = '#';
    renderObj.pageinfo.breadcrumb3rdTitle = '使用者管理';
    renderObj.pageinfo.breadcrumb3rdhref = '#';
    //頁面狀態
    renderObj.pagestatus.type = 'add';
    renderObj.pagestatus.userID = req.session.sessionUserInfo.account;
    renderObj.pagestatus.ACCOUNT_POSITION = enumsUtil.ACCOUNT.POSITION;   //師位
    renderObj.pagestatus.ACCOUNT_STATUS = enumsUtil.ACCOUNT.STATUS;   //狀態

    res.render('pages/sys/account_modify', renderObj);
};

/**
 * 新增帳號資料
 */
accountController.addNewRow = function (req, res) {
    "use strict";

    var data = req.body.account;
    // //設定檔案上傳欄位
    // data = fsUtil.setSaveField(req,data);

    // sys_AccountClass.saveData(data,function(err){
    sys_AccountClass.saveDataFromAPI(req.session.sessionUUID, data, function (err) {
        if (err) {
            res.send(err);
        } else {
            res.redirect('/account');
        }
    });
};

/**
 * 新增角色單頭單身資料
 */
accountController.addHeaderBodyRow = function (req, res) {
    "use strict";

    var data = req.body;
    var roleArray = [];

    //密碼檢查
    var md5PWD = commonUtil.verifyPassword(data.form.password, data.form.password2);
    if (md5PWD == false) {
        var ajaxResult = new ajaxResultClass();
        ajaxResult.error = 1;
        ajaxResult.message = '兩次密碼輸入不符合！';
        res.json(ajaxResult);
        return;
    }

    //組所屬角色資料，後端依據角色取得相關的權限
    if (typeof data.account_roleArray !== 'undefined') {
        data.account_roleArray.forEach(function (row) {
            row.createDateTime = new Date();
            row.createUserId = req.session.sessionUserInfo.account;
            //server更新使用id非_id
            row.id = row._id;
            delete row._id;
            roleArray.push(row);
        });
    }

    //組整個Account資料，新增日期，新增ID，Server端會記錄，可不傳。
    var accountClass = {
        account: data.form.account,
        password: md5PWD,
        position: data.form.position,
        status: data.form.status,
        userName: data.form.userName,
        roleArray: roleArray,
        birthday: data.form.birthday
    };

    sys_AccountClass.saveHeadBodyDataFromAPI(req.session.sessionUUID, accountClass, function (err) {
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
accountController.entryEditPage = function (req, res) {
    var id = req.params.id;
    // sys_AccountClass.getId(id,function(err,accountData){
    sys_AccountClass.getIdFromAPI(req.session.sessionUUID, id, function (err, accountData) {
        if (err) {
            res.send(err);
        } else {
            if (!accountData._id) {
                res.redirect('/');
            } else {

                var renderObj = new renderObjClass();
                //選單
                commonUtil.setCurrentMenuActive(req.session.sys_userMenuList, 'management', 'account');
                renderObj.sidebarmenu.menuList = req.session.sys_userMenuList;
                //頁面內容
                renderObj.pageinfo.pageTitle = '編輯使用者管理';
                renderObj.pageinfo.titleDes = '編輯資料';
                renderObj.pageinfo.tableTitle = '請編輯相關資料';
                renderObj.pageinfo.breadcrumb2ndTitle = '後台管理';
                renderObj.pageinfo.breadcrumb2ndhref = '#';
                renderObj.pageinfo.breadcrumb3rdTitle = '使用者管理';
                renderObj.pageinfo.breadcrumb3rdhref = '#';
                //頁面狀態
                renderObj.pagestatus.type = 'edit';
                renderObj.pagestatus.params = accountData;
                renderObj.pagestatus.userID = req.session.sessionUserInfo.account;
                renderObj.pagestatus.ACCOUNT_POSITION = enumsUtil.ACCOUNT.POSITION;   //師位
                renderObj.pagestatus.ACCOUNT_STATUS = enumsUtil.ACCOUNT.STATUS;   //狀態

                res.render('pages/sys/account_modify', renderObj);
                //res.json(accountData);    
            }
        }
    });
};

/**
 * 編輯帳號資料
 */
accountController.editOneRow = function (req, res) {
    var id = req.params.id;
    // sys_AccountClass.update(id,req.body.account,function(err,data){
    sys_AccountClass.updateFromAPI(id, req.body.account, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            res.redirect('/account');
        }
    });
};

/**
 * DataTables取列表資料
 */
accountController.getDataTableList = function (req, res) {
    "use strict";

    // sys_AccountClass.getList(function(err,accountData){
    sys_AccountClass.getListFromAPI(req.session.sessionUUID, function (err, accountData) {
        var ajaxResult = new ajaxResultClass();

        if (err) {
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.send(ajaxResult);
        } else {
            //console.log(JSON.stringify(accountData));                                
            //ajaxResult.error = 0; 因回傳值需固定格式，所以不用ajaxResult回傳
            res.json(accountData);
        }
    });
};

/**
 * DataTables取編輯頁單身列表資料
*/
accountController.getEditBodyDataTableList = function (req, res) {
    "use strict";
    var id = req.params.id;

    // sys_RoleClass.getList(function(err,roleData){
    sys_AccountClass.getIdBodyDataFromAPI(req.session.sessionUUID, id, function (err, roleData) {
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
accountController.editHeaderBodyRow = function (req, res) {
    var id = req.params.id;

    var data = req.body;
    var roleArray = [];

    //組所屬角色資料，後端依據角色取得相關的權限
    if (typeof data.account_roleArray !== 'undefined') {
        data.account_roleArray.forEach(function (row) {
            //server更新使用id非_id
            row.id = row._id;
            delete row._id;
            row.createDateTime = new Date();
            roleArray.push(row);
        });
    }

    //組整個Account資料，新增日期，新增ID，Server端會記錄，可不傳。
    var accountClass = {
        account: data.form.account,
        password: data.form.password,
        position: data.form.position,
        status: data.form.status,
        userName: data.form.userName,
        roleArray: roleArray,
        birthday: data.form.birthday
    };

    sys_AccountClass.updateHeadBodyDataFromAPI(req.session.sessionUUID, id, accountClass, function (err, data) {
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
 * 重置密碼
 */
accountController.resetPassword = function (req, res) {

    var id = req.params.id;

    sys_AccountClass.resetPasswordFromAPI(req.session.sessionUUID, id, function (err, data) {
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
accountController.getEditBodyDataTableList = function (req, res) {
    "use strict";
    var id = req.params.id;

    // sys_RoleClass.getList(function(err,roleData){
    sys_AccountClass.getIdBodyDataFromAPI(req.session.sessionUUID, id, function (err, roleData) {
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
accountController.DelDataTableRow = function (req, res) {
    var id = req.params.id;

    sys_AccountClass.removeFromAPI(req.session.sessionUUID, id, function (err) {
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

    // //刪除上傳檔案
    // sys_AccountClass.getId(id,function(err,accountData){
    //     var ajaxResult = new ajaxResultClass();

    //     if(err){
    //         ajaxResult.error = 1;
    //         ajaxResult.message = err;
    //         res.json(ajaxResult);
    //     }else{
    //         if(!accountData._id){
    //             ajaxResult.error = 1;
    //             ajaxResult.message = err;
    //             res.json(ajaxResult);
    //         }else{           
    //             //刪除檔案
    //             fsUtil.delFileForDocumnetSync(accountData,uploadFields);
    //         }            
    //     }
    //     //刪除資料
    //     sys_AccountClass.remove(id,function(err){
    //         var ajaxResult = new ajaxResultClass();

    //         if(err){
    //             ajaxResult.error = 1;
    //             ajaxResult.message = err;
    //             res.json(ajaxResult);
    //         }else{
    //             ajaxResult.error = 0;
    //             res.json(ajaxResult);
    //         }
    //     });        
    // });  
};

/**
 * 取得全部列表資料
 */
accountController.getWholeList = function (req, res) {
    "use strict";

    sys_AccountClass.getWholeListFromAPI(req.session.sessionUUID, function (err, accountData) {
        var ajaxResult = new ajaxResultClass();

        if (err) {
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.json(ajaxResult);
        } else {
            ajaxResult.error = 0;
            ajaxResult.data = accountData;
            res.json(ajaxResult);
        }
    });
};

accountController.getExcludeAdminList = function (req, res) {
    "use strict";

    sys_AccountClass.getExcludeAdminListFromAPI(req.session.sessionUUID, function (err, accountData) {
        var ajaxResult = new ajaxResultClass();

        if (err) {
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.json(ajaxResult);
        } else {
            ajaxResult.error = 0;
            ajaxResult.data = accountData;
            res.json(ajaxResult);
        }
    });
};

/**
 * 取得PM資料
 */
accountController.getPMList = function (req, res) {
    "use strict";

    sys_AccountClass.getPMListFromAPI(req.session.sessionUUID, function (err, accountData) {
        var ajaxResult = new ajaxResultClass();

        if (err) {
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.json(ajaxResult);
        } else {
            ajaxResult.error = 0;
            ajaxResult.data = accountData;
            res.json(ajaxResult);
        }
    });
};

/**
 * 取得PM資料
 */
accountController.checkAccountExist = function (req, res) {
    "use strict";
    var account = req.body.account;
    sys_AccountClass.checkAccountExist(account, req.session.sessionUUID, function (err, ajaxResult) {
        if (err) {
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.send(ajaxResult);
        } else {
            res.send(ajaxResult);
        }
    });
};

module.exports = accountController;