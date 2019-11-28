var sysConfig = require('../../configs/sys.config');
var requestUtil = require('../../lib/RequestUtil');

var sys_Privilege = function (data) {
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
sys_Privilege.getIdFromAPI = function (uuid, id, fn) {
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.privilege.getEditList + '/' + id + '?_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body) // Show the HTML for the Google homepage.
            var bodyClass = JSON.parse(body);
            var privilegeClass = new sys_Privilege(bodyClass);

            fn(null, privilegeClass);
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
sys_Privilege.getListFromAPI = function (uuid, fn) {

    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.privilege.getList + '?_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body) // Show the HTML for the Google homepage.
            var bodyClass = JSON.parse(body);
            var privilegeClass = [];
            bodyClass._embedded.privilegeArray.forEach(function (row) {
                var temp = new sys_Privilege(row);
                privilegeClass.push(temp);
            });

            var result = {
                data: privilegeClass
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
sys_Privilege.getWholeListFromAPI = function (uuid, fn) {

    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.privilege.getList + '?_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var bodyClass = JSON.parse(body);
            var privilegeClass = [];
            bodyClass._embedded.privilegeArray.forEach(function (row) {
                var temp = new sys_Privilege(row);
                privilegeClass.push(temp);
            });

            fn(null, privilegeClass);
        } else {
            fn(error || flase);
        }
    });
};

/**
 * 透過API儲存資料
 * @param reqParams post.bady資料
 * @param fn callback(err)
 * return callback(err)
 */
sys_Privilege.saveDataFromAPI = function (uuid, reqParams, fn) {

    //TODO:checkReqParams

    reqParams.createDateTime = new Date();
    var _sys_PrivilegeModel = new sys_Privilege(reqParams);

    requestUtil.POSTUseJSON(sysConfig.API.host + sysConfig.API.url.privilege.saveData + '?_s=' + uuid, _sys_PrivilegeModel, function (error, response, body) {
        //新增成功回傳狀態碼為201 請求成功並建立資源
        if (!error && response.statusCode == 201) {
            fn(null)
        } else {
            fn(error);
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
sys_Privilege.updateFromAPI = function (uuid, id, reqParams, fn) {

    //TODO:checkReqParams

    reqParams.updateDateTime = new Date();
    var _sys_PrivilegeModel = new sys_Privilege(reqParams);

    requestUtil.PUTUseJSON(sysConfig.API.host + sysConfig.API.url.privilege.updateRow + "/" + id + '?_s=' + uuid, _sys_PrivilegeModel, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            // var bodyClass = JSON.parse(body);
            var privilegeClass = new sys_Privilege(body);

            fn(null, privilegeClass)
        } else {
            fn(error);
        }
    });
};

/**
 * 透過API刪除資料
 * @param id _id
 * @param fn callback(err)
 * return callback(err)
 */
sys_Privilege.removeFromAPI = function (uuid, id, fn) {
    requestUtil.DELETE(sysConfig.API.host + sysConfig.API.url.privilege.deleteRow + "/" + id + '?_s=' + uuid, function (error, response, body) {
        //DELETE成功狀態碼回傳204 無資料
        if (!error && response.statusCode == 204) {
            fn(null)
        } else {
            fn(error);
        }
    });
};

module.exports = sys_Privilege;