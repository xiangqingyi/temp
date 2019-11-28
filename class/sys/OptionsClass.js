var sysConfig = require('../../configs/sys.config');
var requestUtil = require('../../lib/RequestUtil');

var sys_Options = function (data) {
    this._id = data.objectId;
    this.name = data.name;
    this.key = data.key;
    this.content = data.content;
    this.description = data.description;
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
sys_Options.getIdFromAPI = function (uuid, id, fn) {
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.options.getEditList + '/' + id + '?_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var bodyClass = JSON.parse(body);
            var optionsClass = new sys_Options(bodyClass);

            fn(null, optionsClass);
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
sys_Options.getListFromAPI = function (uuid, fn) {

    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.options.getList + '?_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var bodyClass = JSON.parse(body);
            var optionsClass = [];
            bodyClass._embedded.optionArray.forEach(function (row) {
                var temp = new sys_Options(row);
                optionsClass.push(temp);
            });

            var result = {
                data: optionsClass
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
sys_Options.saveHeadBodyDataFromAPI = function (uuid, reqParams, fn) {

    //TODO:checkReqParams

    // reqParams.createDateTime = new Date();
    var _sys_OptionsModel = reqParams;

    requestUtil.POSTUseJSON(sysConfig.API.host + sysConfig.API.url.options.saveHeadBodyData + '?_s=' + uuid, _sys_OptionsModel, function (error, response, body) {

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
sys_Options.updateHeadBodyDataFromAPI = function (uuid, id, reqParams, fn) {

    //TODO:checkReqParams

    // var _sys_OptionsModel = new sys_Options(reqParams);
    var _sys_OptionsModel = reqParams;

    requestUtil.PUTUseJSON(sysConfig.API.host + sysConfig.API.url.options.updateHeadBodyData + "/" + id + '?_s=' + uuid, _sys_OptionsModel, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            // var bodyClass = JSON.parse(body);
            var optionsClass = new sys_Options(body);

            fn(null, optionsClass)
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
sys_Options.removeFromAPI = function (uuid,id, fn) {
    requestUtil.DELETE(sysConfig.API.host + sysConfig.API.url.options.deleteRow + "/" + id + '?_s=' + uuid, function (error, response, body) {
        //DELETE成功狀態碼回傳204 無資料
        if (!error && response.statusCode == 204) {
            fn(null)
        } else {
            fn(error);
        }
    });
};

/**
 * 透過API取得資料
 * @param key
 * @param fn callback(err)
 * return callback(err)
 */
sys_Options.getByKey = function (uuid,key, fn) {
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.options.getByKey + key + '&_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var bodyClass = JSON.parse(body);
            var optionsClass = new sys_Options(bodyClass);
            fn(null, optionsClass);
        } else {
            fn(error);
        }
    });
};

module.exports = sys_Options;