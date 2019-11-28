var sysConfig = require('../../configs/sys.config');
var requestUtil = require('../../lib/RequestUtil');

var team_MontthScoreSummary = function (data) {
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
 * 透過API取得列表資料
 * @param fn callback(err,result)
 * return callback(err,result)
 */
team_MontthScoreSummary.getListFromAPI = function (uuid, year, month, fn) {

    var pararLink = '';
    if (year != '' && month != '') {
        pararLink = '/' + year + '/' + month;
    }

    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.monthscore.findScoreSummary + pararLink + '?_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // console.log(body) // Show the HTML for the Google homepage.
            var bodyClass = JSON.parse(body);
            // console.info('bodyClass = ' + bodyClass);
            if (bodyClass.noManagerConfirmList.length > 0) {
                bodyClass.needManagerConfirm = true;
            }

            if (bodyClass.noDataList.length > 0) {
                bodyClass.needAlertTeamLeader = true;
            }

            if (bodyClass.noDataList.length == 0) {
                bodyClass.canExport = true;
            }

            // var weightingClass = [];

            // var unique = arr.filter(function(elem, index, self) {
            //     return index == self.indexOf(elem);
            // })
            //
            //
            // bodyClass.data.forEach(function (row) {
            //     var temp = new team_Weighting(row);
            //     weightingClass.push(temp);
            // });

            // bodyClass.data = weightingClass;

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
 * 主管確認
 * @param id _id
 * @param reqParams post.bady資料
 * @param fn callback(err,data)
 * return callback(err,data)
 */
team_MontthScoreSummary.managerConfirm = function (uuid, reqParams, fn) {
    requestUtil.POSTUseJSON(sysConfig.API.host + sysConfig.API.url.monthscore.managerConfirm + '?_s=' + uuid, reqParams, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // var bodyClass = JSON.parse(body);
            // var weightingClass = new team_MontthScoreSummary(body);

            fn(null, body)
        } else {
            fn(error);
        }
    });
};

/**
 * 主管提醒
 * @param id _id
 * @param reqParams post.bady資料
 * @param fn callback(err,data)
 * return callback(err,data)
 */
team_MontthScoreSummary.alert = function (uuid, reqParams, fn) {
    requestUtil.POSTUseJSON(sysConfig.API.host + sysConfig.API.url.monthscore.alert, reqParams + '?_s=' + uuid, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // var bodyClass = JSON.parse(body);
            // var weightingClass = new team_MontthScoreSummary(body);

            fn(null, body)
        } else {
            fn(error);
        }
    });
};

/**
 * 主管退回
 * @param uuid uuid
 * @param teamId teamId
 * @param fn callback(err,data)
 * return callback(err,data)
 */
team_MontthScoreSummary.managerReject = function (uuid, teamId, fn) {
    requestUtil.POSTUseJSON(sysConfig.API.host + sysConfig.API.url.monthscore.managerReject + '/' + teamId + '?_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            fn(null, body)
        } else {
            fn(error);
        }
    });
};

module.exports = team_MontthScoreSummary;