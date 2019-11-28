var sysConfig = require('../../configs/sys.config');
var requestUtil = require('../../lib/RequestUtil');

var sys_Log = function (data) {
    this._id = data.objectId;
    this.collection = data.collection;
    this.function = data.function;
    this.action = data.action;
    this.other = data.other;
    this.ip = data.ip;
    this.createUserId = (data.createUserId == null ? '':data.createUserId);
    this.createDateTime = data.createDateTime;
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
sys_Log.getIdFromAPI = function (uuid,id, fn) {
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.log.getEditList + '/' + id + '?_s=' + uuid,null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body) // Show the HTML for the Google homepage.
            var bodyClass = JSON.parse(body);
            var logClass = new sys_Log(bodyClass);

            fn(null, logClass);
        } else {
            fn(error);
        }
    });
};

/**
 * 透過API取得列表資料
 * @param size 頁面呈現的數據筆數
 * @param page 第幾頁(開始為0)
 * @param draw datatables要的參數
 * @param fn callback(err,result)
 * return callback(err,result)
 */
sys_Log.getListFromAPI = function (uuid,size,page,draw,sort,quertString,fn) {
    quertString = encodeURIComponent(quertString);
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.log.getList+ '?size=' + size + "&page=" + page+ "&draw=" + draw+ "&sort=" + sort+ "&queryString=" + quertString + '&_s=' + uuid,null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // console.log(body) // Show the HTML for the Google homepage.
            var bodyClass = JSON.parse(body);
            var logClass = [];
            bodyClass._embedded.logArray.forEach(function (row) {
                var temp = new sys_Log(row);
                logClass.push(temp);
            });
            var result = {
                data: logClass,
                draw: draw,
                recordsTotal: bodyClass.page.totalElements,
                recordsFiltered: bodyClass.page.totalElements //bodyClass._embedded.logArray.length
            };
            fn(null, result);
        } else {
            fn(error);
        }
    });
};

/**
 * 透過API儲存資料
 * @param reqParams post.bady資料
 * @param fn callback(err)
 * return callback(err)
 */
sys_Log.saveDataFromAPI = function (uuid,reqParams, fn) {

    //TODO:checkReqParams

    reqParams.createDateTime = new Date();
    var _sys_LogModel = new sys_Log(reqParams);

    requestUtil.POSTUseJSON(sysConfig.API.host + sysConfig.API.url.log.saveData + '?_s=' + uuid, _sys_LogModel, function (error, response, body) {
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
sys_Log.updateFromAPI = function (uuid,id, reqParams, fn) {

    //TODO:checkReqParams

    reqParams.updateDateTime = new Date();
    var _sys_LogModel = new sys_Log(reqParams);

    requestUtil.POSTUseJSON(sysConfig.API.host + sysConfig.API.url.log.updateRow + "/" + id + '?_s=' + uuid,_sys_LogModel, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            // var bodyClass = JSON.parse(body);
            var logClass = new sys_Log(body);

            fn(null, logClass)
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
sys_Log.removeFromAPI = function (uuid,id, fn) {
    requestUtil.DELETE(sysConfig.API.host + sysConfig.API.url.log.updateRow + "/" + id + '?_s=' + uuid, function (error, response, body) {
        //DELETE成功狀態碼回傳204 無資料
        if (!error && response.statusCode == 204) {
            fn(null)
        } else {
            fn(error);
        }
    });
};

module.exports = sys_Log;