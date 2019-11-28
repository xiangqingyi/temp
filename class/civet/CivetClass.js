var url = require("url");
var cheerio = require('cheerio');

var sysConfig = require('../../configs/sys.config');
var requestUtil = require('../../lib/RequestUtil');
var encrypUtil = require('../../lib/EncryptUtil');
var logUtil = require('../../lib/loggerUtil');

var civetClass = function (data) {
    this.account = data.account;
    this.password = data.password;
};

/**
 * 紀錄登入Log
 */
civetClass.saveLoginLog = function (accInfo, fn) {
    requestUtil.POSTUseJSON(sysConfig.API.host + sysConfig.API.url.monthscore.accessLog, accInfo, function (error, response, body) {
        fn(error, body);
    });
};

/**
 * 登入驗證
 */
civetClass.civetLoginAccount = function (uuid, data, fn) {
    var nowDate = new Date();
    var yearMonthDay = nowDate.getFullYear().toString() + (nowDate.getMonth() + 1).toString() + nowDate.getDate().toString();
    var fromModel = {
        uid: data.account,
        pwd: encrypUtil.MD5('1wdv5rdx' + yearMonthDay),
        t: Date.parse(new Date()) / 1000
    };
    //需要Urlencode再傳輸。超過30秒無效
    var encrypFromModel = encodeURIComponent(encrypUtil.AES128Utf8ToBase64Encrypt(JSON.stringify(fromModel)));

    requestUtil.POST(sysConfig.API.host + sysConfig.API.url.login.civetLoginAccount + '?_s=' + uuid, encrypFromModel, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var bodyClass = JSON.parse(body);

            fn(null, bodyClass);
        } else {
            logUtil.error('登入失敗。error:%j,StatusCode:%s,encryp:%s 。 %j', error, response.statusCode, encrypFromModel, fromModel);
            fn(error);
        }
    });
};

/**
 * 透過API取得Qrcode
 * @param fn callback(err,result)
 * return callback(err,result)
 */
civetClass.GetQrcodeFromAPI = function (uuid, fn) {
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.civet.getQrcode + '?_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var bodyClass = JSON.parse(body);
            var result = {
                data: bodyClass.data.qrcodeUrl
            };
            fn(null, result);
        } else {
            fn(error);
        }
    });
};

/**
 * 取得Qrcode
 * @param fn callback(err,result)
 * return callback(err,result)
 */
civetClass.GetQrcode = function (fn) {
    requestUtil.GETWithCookie(sysConfig.CIVET.HOST + sysConfig.CIVET.URL.GET_QRCODE + '&appid=' + sysConfig.CIVET.APPID, null, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body);
            var img = $('img')[0];
            var newImgSrc = 'http://civetinterface.foxconn.com/' + $(img).attr('src');
            // $(img).attr('src',newImgSrc);
            //console.log('123'+$(img));
            var cookieString = response.headers['set-cookie'][0];

            var result = {
                data: newImgSrc,
                cookieString: cookieString
            };
            fn(null, result);
        } else {
            fn(error || '連線' + sysConfig.CIVET.HOST + '異常');
        }
    });
};

/**
 * 透過API取得狀態
 * @param fn callback(err,result)
 * return callback(err,result)
 */
civetClass.ScanFromAPI = function (uuid, fn) {

    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.civet.scan + '?_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var bodyClass = JSON.parse(body);
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
 * 透過API取得狀態
 * @param fn callback(err,result)
 * return callback(err,result)
 */
civetClass.Scan = function (cookie, fn) {

    requestUtil.GETWithCookie(sysConfig.CIVET.HOST + sysConfig.CIVET.URL.GET_SCANRESLUT + '?t=' + new Date().getTime(), null, cookie, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var bodyClass = JSON.parse(body);
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
 * Qrcode登入
 * @param fn callback(err,result)
 * return callback(err,result)
 */
civetClass.POSTSignin = function (cookie, fn) {
    var POSTForm = {
        ScanLogin: 'OK'
    };

    requestUtil.POSTWithCookie(sysConfig.CIVET.HOST + sysConfig.CIVET.URL.GET_QRCODE + '&appid=' + sysConfig.CIVET.APPID, POSTForm, cookie, function (error, response, body) {
        //response.statusCode會是302
        if (!error && (response.statusCode == 200 || response.statusCode == 302)) {
            try {
                var $ = cheerio.load(body);
                // var $ = cheerio.load('<html><head><title>Object moved</title></head><body><h2>Object moved to <a href="http://10.142.214.89:3030/civetsso?code=ae55399z_9wGstI8MoMROC12pHogMGO-RSODxBiJ-5YeiYp41">here</a>.</h2></body></html>');                
                var Object_a = $('a')[0];
                //http://10.142.214.89:3030/civetsso?code=ae55399z_9wGstI8MoMROC12pHogMGO-RSODxBiJ-5YeiYp41
                var a_href = $(Object_a).attr('href');
                if (typeof a_href !== 'undefined') {
                    var urlQuery = url.parse($(Object_a).attr('href'), true).query;
                    var codeString = urlQuery.code;

                    var result = {
                        code: codeString
                    };

                    fn(null, result);
                } else {
                    fn(true);
                }
            } catch (catchError) {
                logUtil.err('POSTSignin error:%s', catchError);
                fn(true);
            }
        } else {
            fn(error);
        }
    });
};

module.exports = civetClass;