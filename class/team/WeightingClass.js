var sysConfig = require('../../configs/sys.config');
var requestUtil = require('../../lib/RequestUtil');

var team_Weighting = function (data) {
    this._id = data.objectId;
    this.year = data.year;
    this.month = data.month;
    this.weighting = data.weighting;
    this.weightingArray = data.weightingArray;
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
team_Weighting.getIdFromAPI = function (uuid, id, fn) {
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.weighting.getEditList + '/' + id + '?_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body) // Show the HTML for the Google homepage.
            var bodyClass = JSON.parse(body);
            var weightingClass = new team_Weighting(bodyClass);

            fn(null, weightingClass);
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
team_Weighting.getListFromAPI = function (uuid, year, fn) {

    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.weighting.getList + year + '&_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // console.log(body) // Show the HTML for the Google homepage.
            var bodyClass = JSON.parse(body);
            var weightingClass = [];

            // var unique = arr.filter(function(elem, index, self) {
            //     return index == self.indexOf(elem);
            // })
            //
            //
            bodyClass.data.forEach(function (row) {
                var temp = new team_Weighting(row);
                weightingClass.push(temp);
            });

            bodyClass.data = weightingClass;

            var result = {
                data: bodyClass
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
team_Weighting.saveDataFromAPI = function (uuid, reqParams, fn) {

    //TODO:checkReqParams

    reqParams.createDateTime = new Date();
    var _team_WeightingModel = new team_Weighting(reqParams);
    requestUtil.POSTUseJSON(sysConfig.API.host + sysConfig.API.url.weighting.saveData + '?_s=' + uuid, _team_WeightingModel, function (error, response, body) {
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
team_Weighting.updateFromAPI = function (uuid, id, reqParams, fn) {

    reqParams.objectId = id;
    var _team_WeightingModel = new team_Weighting(reqParams);
    _team_WeightingModel.weightingArray.forEach(function (d) {
        d.weightingScore = parseInt(_team_WeightingModel.weighting[d.teamId].weightingScore);
    });

    _team_WeightingModel.weighting = null;
    // console.log(_team_WeightingModel);
    // console.log(sysConfig.API.host + sysConfig.API.url.weighting.saveData + "/" + id);
    requestUtil.PUTUseJSON(sysConfig.API.host + sysConfig.API.url.weighting.saveData + "/" + id + '?_s=' + uuid, _team_WeightingModel, function (error, response, body) {

        console.log(response.statusCode);
        if (!error && response.statusCode == 200) {
            // var bodyClass = JSON.parse(body);
            var weightingClass = new team_Weighting(body);

            fn(null, weightingClass)
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
team_Weighting.removeFromAPI = function (uuid, id, fn) {
    requestUtil.DELETE(sysConfig.API.host + sysConfig.API.url.weighting.delete + "/" + id + '?_s=' + uuid, function (error, response, body) {
        //DELETE成功狀態碼回傳204 無資料
        if (!error && response.statusCode == 204) {
            fn(null)
        } else {
            fn(error);
        }
    });
};

module.exports = team_Weighting;