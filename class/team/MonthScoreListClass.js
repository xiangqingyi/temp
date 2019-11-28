var sysConfig = require('../../configs/sys.config');
var requestUtil = require('../../lib/RequestUtil');

var team_MonthScoreList = function (data) {
    this._id = data.objectId;
    this.teamId = data.teamId;
    this.teamName = data.teamName;
    this.memberId = data.memberId;
    this.memberName = data.memberName;
    this.memberScore = data.memberScore;
    this.memberScoreRank = data.memberScoreRank
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
team_MonthScoreList.getIdFromAPI = function (uuid, id, fn) {
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.monthscorelist.getEditList + '/' + id + '?_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body) // Show the HTML for the Google homepage.
            var bodyClass = JSON.parse(body);
            var monthScoreClass = new team_MonthScoreList(bodyClass);

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
team_MonthScoreList.getListFromAPI = function (uuid, fn) {
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.monthscorelist.getList + '?_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // console.log(body); // Show the HTML for the Google homepage.
            var bodyClass = JSON.parse(body);
            var monthScoreClass = [];
            bodyClass._embedded.teamMonthScoreListArray.forEach(function (row) {
                var temp = new team_MonthScoreList(row);
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
 * 透過API取得列表資料
 * @param fn callback(err,result)
 * return callback(err,result)
 */
team_MonthScoreList.getScoreInfoFromAPI = function (uuid, teamId, year, month, fn) {
    var pararLink = '';
    if (year != '' && month != '') {
        pararLink = '/' + year + '/' + month;
    }

    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.monthscorelist.getScoreList + pararLink + '?_s=' + uuid + '&teamId=' + teamId, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // console.log(body); // Show the HTML for the Google homepage.
            var bodyClass = JSON.parse(body);

            console.log(bodyClass);

            // {
            //     "teamName": "Team A",
            //     "hasData": false,
            //     "name": "Team Member A1",
            //     "teamMemberCount": null,
            //     "rankPosition": null
            // }

            // var monthScoreClass = [];
            // bodyClass._embedded.teamMonthScoreListArray.forEach(function (row) {
            //     var temp = new team_MonthScoreList(bodyClass);
            // monthScoreClass.push(temp);
            // });

            // var result = {
            //     data: temp
            // };
            // console.log('------');
            // console.log(result);

            fn(null, bodyClass);
        } else {
            fn(error);
        }
    });
};

/**
 * 用Id透過API取得列表資料
 * @param fn callback(err,result)
 * return callback(err,result)
 */
team_MonthScoreList.getScoreInfoByIdFromAPI = function (uuid, id, year, month, fn) {
    var params = '';
    if (year != '' && month != '') {
        params = '/' + year + '/' + month;
    }
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.monthscorelist.getScoreListByAccount + '/' + id + params + '?_s=' + uuid, null, function (error, response, body) {
        console.log('getScoreInfoByIdFromAPI status:' + response.statusCode);
        if (!error && response.statusCode == 200) {
            var bodyClass = JSON.parse(body);

            fn(null, bodyClass);
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
team_MonthScoreList.saveDataFromAPI = function (uuid, reqParams, fn) {

    //TODO:checkReqParams

    reqParams.createDateTime = new Date();
    var _team_MonthScoreListModel = new team_MonthScoreList(reqParams);

    requestUtil.POSTUseJSON(sysConfig.API.host + sysConfig.API.url.monthscorelist.saveData + '?_s=' + uuid, _team_MonthScoreListModel, function (error, response, body) {
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
team_MonthScoreList.updateFromAPI = function (uuid, id, reqParams, fn) {

    //TODO:checkReqParams

    reqParams.updateDateTime = new Date();
    var _team_MonthScoreListModel = new team_MonthScoreList(reqParams);

    requestUtil.POSTUseJSON(sysConfig.API.host + sysConfig.API.url.monthscorelist.updateRow + "/" + id + '?_s=' + uuid, _team_MonthScoreListModel, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            // var bodyClass = JSON.parse(body);
            var monthScoreClass = new team_MonthScoreList(body);

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
team_MonthScoreList.removeFromAPI = function (uuid, id, fn) {
    requestUtil.DELETE(sysConfig.API.host + sysConfig.API.url.monthscorelist.updateRow + "/" + id + '?_s=' + uuid, function (error, response, body) {
        //DELETE成功狀態碼回傳204 無資料
        if (!error && response.statusCode == 204) {
            fn(null)
        } else {
            fn(error);
        }
    });
};

module.exports = team_MonthScoreList;