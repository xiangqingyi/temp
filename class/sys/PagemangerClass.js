var sysConfig = require('../../configs/sys.config');
var requestUtil = require('../../lib/RequestUtil');
var sys_privilegeClass = require('./PrivilegeClass');

var sys_Pagemanger = function (data) {
    this._id = data.objectId;
    this.name = data.name;
    this.path = data.path;
    this.privilegeArray = data.privilegeArray;
    this.createUserId = data.createUserId;
    this.createDateTime = data.createDateTime;
    this.updateUserId = data.updateUserId;
    this.updateDateTime = data.updateDateTime;
};

var sys_PagemangerTalbeOneRowList = function (data) {
    this._id = data.objectId;
    this.name = data.name;
    this.path = data.path;
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
sys_Pagemanger.getIdFromAPI = function (uuid,id, fn) {
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.pagemanger.getEditList + '/' + id + '?_s=' + uuid,null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body) // Show the HTML for the Google homepage.
            var bodyClass = JSON.parse(body);
            var pagemangerClass = new sys_Pagemanger(bodyClass);

            fn(null, pagemangerClass);
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
sys_Pagemanger.getIdBodyDataFromAPI = function (uuid,id, fn) {
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.pagemanger.getEditTableList + '/' + id + '?_s=' + uuid,null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body) // Show the HTML for the Google homepage.
            var bodyClass = JSON.parse(body);
            var pagemangerPrivilegeClass = [];            
            if(bodyClass.privilegeArray != null){
                bodyClass.privilegeArray.forEach(function (row) {
                    var temp = new sys_privilegeClass(row);
                    pagemangerPrivilegeClass.push(temp);
                });
            }
            
            var result = {
                data: pagemangerPrivilegeClass
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
sys_Pagemanger.getListFromAPI = function (uuid,fn) {

    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.pagemanger.getList + '?_s=' + uuid,null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body) // Show the HTML for the Google homepage.
            var bodyClass = JSON.parse(body);
            var pagemangerClass = [];
            bodyClass._embedded.pageArray.forEach(function (row) {
                var temp = new sys_PagemangerTalbeOneRowList(row);
                pagemangerClass.push(temp);
            });

            var result = {
                data: pagemangerClass
            };
            fn(null, result);
        } else {
            fn(error);
        }
    });
};

/**
 * 透過API儲存單頭單身資料
 * @param reqParams post.bady資料
 * @param fn callback(err)
 * return callback(err)
 */
sys_Pagemanger.saveHeadBodyDataFromAPI = function (uuid,reqParams, fn) {

    //TODO:checkReqParams

    // reqParams.createDateTime = new Date();
    var _sys_PagemangerModel = reqParams;

    requestUtil.POSTUseJSON(sysConfig.API.host + sysConfig.API.url.pagemanger.saveHeadBodyData + '?_s=' + uuid, _sys_PagemangerModel, function (error, response, body) {

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
sys_Pagemanger.updateHeadBodyDataFromAPI = function (uuid,id, reqParams, fn) {

    //TODO:checkReqParams

    // var _sys_PagemangerModel = new sys_Pagemanger(reqParams);
    var _sys_PagemangerModel = reqParams;

    requestUtil.PUTUseJSON(sysConfig.API.host + sysConfig.API.url.pagemanger.updateHeadBodyData + "/" + id + '?_s=' + uuid,_sys_PagemangerModel, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            // var bodyClass = JSON.parse(body);
            var pagemangerClass = new sys_Pagemanger(body);

            fn(null, pagemangerClass)
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
sys_Pagemanger.removeFromAPI = function (uuid,id, fn) {
    requestUtil.DELETE(sysConfig.API.host + sysConfig.API.url.pagemanger.deleteRow + "/" + id + '?_s=' + uuid, function (error, response, body) {
        //DELETE成功狀態碼回傳204 無資料
        if (!error && response.statusCode == 204) {
            fn(null)
        } else {
            fn(error);
        }
    });
};

module.exports = sys_Pagemanger;