var sysConfig = require('../../configs/sys.config');
var requestUtil = require('../../lib/RequestUtil');
var sys_privilegeClass = require('./PrivilegeClass');

var sys_Role = function (data) {
    this._id = data.objectId;
    this.name = data.name;
    this.key = data.key;
    this.isHRmanager = data.isHRmanager || 0;
    this.privilegeArray = data.privilegeArray;
    this.createUserId = data.createUserId;
    this.createDateTime = data.createDateTime;
    this.updateUserId = data.updateUserId;
    this.updateDateTime = data.updateDateTime;
};

var sys_RoleTalbeOneRowList = function (data) {
    this._id = data.objectId;
    this.name = data.name;
    this.key = data.key;
    this.createUserId = data.createUserId;
    this.createDateTime = data.createDateTime;
    this.updateUserId = data.updateUserId;
    this.updateDateTime = data.updateDateTime;
};

var queryFields = {
    _id: 1,
    userid: 1,
    name: 1,
    email: 1,
    tel: 1,
    photo: 1
};

/**
 * 透過API依照id取得資料
 * @param id MongoDB _id
 * @param fn callback(err)
 * return callback(err)
 */
sys_Role.getIdFromAPI = function (uuid, id, fn) {
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.role.getEditList + '/' + id + '?_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body) // Show the HTML for the Google homepage.
            var bodyClass = JSON.parse(body);
            var roleClass = new sys_Role(bodyClass);

            fn(null, roleClass);
        } else {
            fn(error);
        }
    });
};

/**
 * 透過API依照id取得單身資料
 * @param id MongoDB _id
 * @param fn callback(err)
 * return callback(err)
 */
sys_Role.getIdBodyDataFromAPI = function (uuid, id, fn) {
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.role.getEditTableList + '/' + id + '?_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body) // Show the HTML for the Google homepage.
            var bodyClass = JSON.parse(body);
            var rolePrivilegeClass = [];
            if (bodyClass.privilegeArray != null) {
                bodyClass.privilegeArray.forEach(function (row) {
                    var temp = new sys_privilegeClass(row);
                    rolePrivilegeClass.push(temp);
                });
            }

            var result = {
                data: rolePrivilegeClass
            };

            fn(null, result);
        } else {
            fn(error);
        }
    });
};

/**
 * 透過API取得列表資料
 * @param fn callback(err,result)
 * return callback(err,result)
 */
sys_Role.getListFromAPI = function (uuid, fn) {

    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.role.getList + '?_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body) // Show the HTML for the Google homepage.
            var bodyClass = JSON.parse(body);
            var roleClass = [];
            bodyClass._embedded.roleArray.forEach(function (row) {
                var temp = new sys_RoleTalbeOneRowList(row);
                roleClass.push(temp);
            });

            var result = {
                data: roleClass
            };
            fn(null, result);
        } else {
            fn(error);
        }
    });
};

/**
 * 透過API取得全部列表資料
 * @param fn callback(err,result)
 * return callback(err,result)
 */
sys_Role.getWholeListFromAPI = function (uuid, fn) {

    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.role.getList + '?_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var bodyClass = JSON.parse(body);
            var roleClass = [];
            bodyClass._embedded.roleArray.forEach(function (row) {
                var temp = new sys_Role(row);
                roleClass.push(temp);
            });

            fn(null, roleClass);
        } else {
            fn(error || flase);
        }
    });
};

/**
 * 透過API儲存單頭單身資料
 * @param reqParams post.bady資料
 * @param fn callback(err)
 * return callback(err)
 */
sys_Role.saveHeadBodyDataFromAPI = function (uuid, reqParams, fn) {

    //TODO:checkReqParams

    // reqParams.createDateTime = new Date();
    var _sys_RoleModel = reqParams;

    requestUtil.POSTUseJSON(sysConfig.API.host + sysConfig.API.url.role.saveHeadBodyData + '?_s=' + uuid, _sys_RoleModel, function (error, response, body) {

        //新增成功回傳狀態碼為201 請求成功並建立資源
        if (!error && response.statusCode == 201) {
            fn(null)
        } else {
            fn(false);
        }
    });
};

/**
 * 透過API修改資料
 * @param id _id
 * @param reqParams post.bady資料
 * @param fn callback(err,data)
 * return callback(err,data)
 */
sys_Role.updateHeadBodyDataFromAPI = function (uuid, id, reqParams, fn) {

    //TODO:checkReqParams

    // var _sys_RoleModel = new sys_Role(reqParams);
    var _sys_RoleModel = reqParams;

    requestUtil.PUTUseJSON(sysConfig.API.host + sysConfig.API.url.role.updateHeadBodyData + "/" + id + '?_s=' + uuid, _sys_RoleModel, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            // var bodyClass = JSON.parse(body);
            var roleClass = new sys_Role(body);

            fn(null, roleClass)
        } else {
            fn(error || false);
        }
    });
};

/**
 * 透過API刪除資料
 * @param id _id
 * @param fn callback(err)
 * return callback(err)
 */
sys_Role.removeFromAPI = function (uuid, id, fn) {
    requestUtil.DELETE(sysConfig.API.host + sysConfig.API.url.role.deleteRow + "/" + id + '?_s=' + uuid, function (error, response, body) {
        //DELETE成功狀態碼回傳204 無資料
        if (!error && response.statusCode == 204) {
            fn(null)
        } else {
            fn(error);
        }
    });
};

module.exports = sys_Role;