var sysConfig = require('../../configs/sys.config');
var requestUtil = require('../../lib/RequestUtil');

var team_MonthScoreQA = function (data) {
    this._id = data.objectId;
    this.teamMonthScoreId = data.teamMonthScoreId;
    this.memberName = data.memberName;
    this.question = data.question;
    this.leaderId = data.leaderId;
    this.leaderName = data.leaderName;
    this.answer = data.answer;
    this.year = data.year;
    this.month = data.month;
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
team_MonthScoreQA.getIdFromAPI = function (uuid, id, fn) {
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.monthscoreqa.getEditList + '/' + id + '?_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body) // Show the HTML for the Google homepage.
            var bodyClass = JSON.parse(body);
            var monthScoreClass = new team_MonthScoreQA(bodyClass);

            fn(null, monthScoreClass);
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
team_MonthScoreQA.getListFromAPI = function (uuid, fn) {

    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.monthscoreqa.getList + '?_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // console.log(body); // Show the HTML for the Google homepage.
            var bodyClass = JSON.parse(body);
            var monthScoreClass = [];
            bodyClass._embedded.teamMonthScoreQAArray.forEach(function (row) {
                var temp = new team_MonthScoreQA(row);
                monthScoreClass.push(temp);
            });

            var result = {
                data: monthScoreClass
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
team_MonthScoreQA.saveDataFromAPI = function (uuid, reqParams, fn) {

    //TODO:checkReqParams

    reqParams.createDateTime = new Date();
    var _team_MonthScoreQAModel = new team_MonthScoreQA(reqParams);

    requestUtil.POSTUseJSON(sysConfig.API.host + sysConfig.API.url.monthscoreqa.saveData + '?_s=' + uuid, _team_MonthScoreQAModel, function (error, response, body) {
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
team_MonthScoreQA.updateFromAPI = function (uuid, id, reqParams, fn) {

    //TODO:checkReqParams

    reqParams.updateDateTime = new Date();
    var _team_MonthScoreQAModel = new team_MonthScoreQA(reqParams);

    requestUtil.POSTUseJSON(sysConfig.API.host + sysConfig.API.url.monthscoreqa.updateRow + "/" + id + '?_s=' + uuid, _team_MonthScoreQAModel, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            // var bodyClass = JSON.parse(body);
            var monthScoreClass = new team_MonthScoreQA(body);

            fn(null, monthScoreClass)
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
team_MonthScoreQA.removeFromAPI = function (uuid, id, fn) {
    requestUtil.DELETE(sysConfig.API.host + sysConfig.API.url.monthscoreqa.updateRow + "/" + id + '?_s=' + uuid, function (error, response, body) {
        //DELETE成功狀態碼回傳204 無資料
        if (!error && response.statusCode == 204) {
            fn(null)
        } else {
            fn(error);
        }
    });
};

module.exports = team_MonthScoreQA;