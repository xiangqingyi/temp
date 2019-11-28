var sysConfig = require('../../configs/sys.config');
var requestUtil = require('../../lib/RequestUtil');

var year_RankPercent = function(data){
    this.year = data.year;
    this.total = data.total;
    this.type1Count = data.type1Count;
    this.type2Count = data.type2Count;
    this.aplusCountBase = data.aplusCountBase;
    this.acountBase = data.acountBase;
    this.bcountBase = data.bcountBase;
    this.ccountBase = data.ccountBase;

    this.type1APlus = data.type1APlus;
    this.type1A = data.type1A;
    this.type1B = data.type1B;
    this.type1C = data.type1C;

    this.type2APlus = data.type2APlus;
    this.type2A = data.type2A;
    this.type2B = data.type2B;
    this.type2C = data.type2C;

};

var queryFields = {
    _id: 1
};

/**
 * 透過API取得列表資料
 * @param fn callback(err,result)
 * return callback(err,result)
 */
year_RankPercent.getListFromAPI = function (year,fn) {
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.rankpercent.getByYear + year,null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body) // Show the HTML for the Google homepage.
            var bodyClass = JSON.parse(body);

            var temp = new year_RankPercent(bodyClass);

            var result = {
                data:temp
            };
            fn(null, result);
        } else {
            fn(error);
        }
    });
};

module.exports = year_RankPercent;