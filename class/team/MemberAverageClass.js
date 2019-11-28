var sysConfig = require('../../configs/sys.config');
var requestUtil = require('../../lib/RequestUtil');

var report_Report = function (data) {
    this.columns = data.columns;
    this.data = data.data;
    this.header = data.header;
};

var queryFields = {
    _id: 1
};

/**
 * 透過API取得列表資料
 * @param fn callback(err,result)
 * return callback(err,result)
 */
report_Report.getListDataFromAPI = function (uuid, range, start, end, accounts, teams, fn) {

    var reqData = {
        accounts: accounts.toString(),
        teams: teams.toString()
    };
    //暫時把range拿掉，不用傳
    // requestUtil.POST(sysConfig.API.host + sysConfig.API.url.member.getTeamAverage + '/' + range + '/' + start + '/' + end,reqData, function (error, response, body) {
    requestUtil.POST(sysConfig.API.host + sysConfig.API.url.member.getTeamAverage + '/' + start + '/' + end + '?_s=' + uuid, reqData, function (error, response, body) {

        if (!error && response.statusCode == 200) {

            var bodyClass = JSON.parse(body);

            var temp = new report_Report(bodyClass);

            var result = {
                data: temp
            };
            fn(null, result);
        } else {
            fn(true);
        }
    });
};

module.exports = report_Report;