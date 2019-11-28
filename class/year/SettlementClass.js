var sysConfig = require('../../configs/sys.config');
var requestUtil = require('../../lib/RequestUtil');

var year_Settlement = function (data) {
    this._id = data.objectId;
    this.year = data.year;
    this.version = data.version;
    this.scoreArray = data.scoreArray;
    this.yearRankPercent = data.yearRankPercent;
    this.aplusList = data.aplusList;
    this.alist = data.alist;
    this.blist = data.blist;
    this.clist = data.clist;
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
year_Settlement.getIdFromAPI = function (uuid, id, fn) {

    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.yearsettlement.getEditList + '/' + id + '?_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body) // Show the HTML for the Google homepage.
            var bodyClass = JSON.parse(body);
            var yearSettlementClass = new year_Settlement(bodyClass);

            fn(null, yearSettlementClass);
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
year_Settlement.getListFromAPI = function (uuid, fn) {
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.yearsettlement.getList + '?_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body) // Show the HTML for the Google homepage.
            var bodyClass = JSON.parse(body);
            var privilegeClass = [];
            bodyClass.forEach(function (row) {
                var temp = new year_Settlement(row);
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
 * 透過API修改資料
 * @param id _id
 * @param reqParams post.bady資料
 * @param fn callback(err,data)
 * return callback(err,data)
 */
year_Settlement.updateFromAPI = function (uuid, id, reqParams, fn) {

    requestUtil.PUTUseJSON(sysConfig.API.host + sysConfig.API.url.yearsettlement.saveData + "/" + id + '?_s=' + uuid, reqParams.dataArray, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            fn(null)
        } else {
            fn(error);
        }
    });
};

module.exports = year_Settlement;