var sysConfig = require('../../configs/sys.config');
var requestUtil = require('../../lib/RequestUtil');

var report_Report = function(data){
    this.columns = data.columns;
    this.data = data.data;
    this.header = data.header;
};

var ChartData = function(data,key){
    var color = getRandomColor();

    this.label =  data.userName;
    this.backgroundColor= color;
    this.borderColor = color;
    this.fill = false;

    var values = [];
    for (var i = 0; i < key.length; i++) {
        var row = key[i];

        if (data.data == null || data.data == undefined) {
            values.push(NaN);
        } else {
            if (data.data[row] != null && data.data[row] != undefined) {
                values.push(data.data[row].total);
            } else {
                values.push(NaN);
            }
        }
    }
    this.data= values;
};

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

var queryFields = {
    _id: 1
};

/**
 * 透過API取得列表資料
 * @param fn callback(err,result)
 * return callback(err,result)
 */
report_Report.getListDataFromAPI = function (range,start,end,accounts,teams,fn) {

    var reqData = {
        accounts : accounts.toString(),
        teams : teams.toString()
    };

    requestUtil.POST(sysConfig.API.host + sysConfig.API.url.report.getListData + '/' + range + '/' + start + '/' + end,reqData, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            var bodyClass = JSON.parse(body);

            var temp = new report_Report(bodyClass);

            var result = {
                data:temp
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
report_Report.getChartDataFromAPI = function (range,start,end,accounts,teams,fn) {

    var reqData = {
        accounts : accounts.toString(),
        teams : teams.toString()
    };

    requestUtil.POST(sysConfig.API.host + sysConfig.API.url.report.getListData + '/' + range + '/' + start + '/' + end,reqData, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            var bodyClass = JSON.parse(body);

            var temp = new report_Report(bodyClass);

            try {
                var key = [];
                var indexColums = 0;
                bodyClass.columns.forEach(function (row) {
                    if (indexColums % 2 == 0) {
                        key.push(row.data.split('.')[1]);
                    }
                    indexColums++;
                });
                var datasets = [];
                bodyClass.data.forEach(function (row) {
                    var temp = new ChartData(row,key);
                    datasets.push(temp);
                });
            } catch(err) {
                console.log(err);
            }
            var result = {
                data:temp,
                datasets:datasets
            };

            fn(null, result);
        } else {
            fn(error);
        }
    });
};

module.exports = report_Report;