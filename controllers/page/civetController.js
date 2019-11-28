var uuidV1 = require('uuid/v1');
var cookiePakage = require('cookie');
var url = require('url');

var civetClass = require('../../class/civet/CivetClass');
var loginClass = require('../../class/LoginClass');
var ajaxResultClass = require('../../class/AjaxResultClass');

var requestUtil = require('../../lib/RequestUtil');
var logUtil = require('../../lib/loggerUtil');

var civetController = function () { };

/**
 * Civet登入帳號頁面
 */
civetController.entryLogin = function (req, res, next) {
    "use strict";

    var goWhere = url.resolve('/', (typeof req.params.gowhere !== 'undefined') ? req.params.gowhere : 'monthscorelist');

    var errorlog = 0;
    try {
        logUtil.info('香信SSO登入');
        logUtil.info('cinetUserInfo：%j', req.session.civetUserInfo);

        var id = '';
        if (typeof req.session.civetUserInfo !== 'undefined') {
            id = req.session.civetUserInfo.civetno.toUpperCase();
        }

        var accInfo = {
            "account": id
        };
        //登入時建立UUID
        req.session.sessionUUID = uuidV1();

        //瀏覽紀錄
        civetClass.saveLoginLog(accInfo, function (error, bodyResult) {
            //civet登入驗證
            civetClass.civetLoginAccount(req.session.sessionUUID, accInfo, function (err, civetLoginResult) {
                if (err) {
                    logUtil.error('資料庫讀取錯誤 error：%s', err);
                    res.send('資料錯誤，無法取得訊息。請稍後再試。');
                    return;
                } else {
                    if (typeof civetLoginResult !== 'undefined') {
                        if (civetLoginResult.code != 0) {
                            logUtil.error('香信ID:%s 查詢有誤，code:%s ,message:%s', id, civetLoginResult.code, civetLoginResult.message);
                            res.send('此帳號查詢有誤，請洽管理人員。code:' + civetLoginResult.code);
                            return;
                        } else {
                            //驗證成功後dosomething
                            loginClass.loginSucessDoing(req.session.sessionUUID, req, civetLoginResult, function (errDoing, sucessResult) {
                                if (errDoing) {
                                    logUtil.error('系統資訊載入失敗。error:%j', errDoing);
                                    res.send('系統有誤，請稍後再試。');
                                } else {
                                    res.redirect(goWhere);
                                }
                                return;
                            });
                        }
                    } else {
                        logUtil.error('香信ID:%s 在系統查不到資料，回傳undefined。', id);
                        res.send('未在考績系統建立此帳號，請洽管理人員。');
                        return;
                    }
                }
            });
        });
    } catch (ex) {
        errorlog = 10;
        logUtil.error('scoreController error：%s', ex);
        res.send('資料錯誤，無法取得訊息。' + errorlog);
    }

};

/**
 * qr code 登入
 */
civetController.signin = function (req, res, next) {
    "use strict";

    var cookie = req.session.civetQrcodeCookie;
    logUtil.info('Signin Cookie：%s', cookie);

    civetClass.POSTSignin(cookie, function (err, repData) {
        if (err == true) {
            res.send('香信QRCode登入錯誤！');
        } else {
            var code = repData.code;
            res.redirect('/civetsso?code=' + code);
        }
    });

};

/**
 * 取得qr code By API
 */
civetController.getQrcodeFromAPI = function (req, res) {
    "use strict";

    var id = req.params.id;
    civetClass.GetQrcodeFromAPI(id, function (err, repData) {
        var ajaxResult = new ajaxResultClass();

        if (err) {
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.send(ajaxResult);
        } else {
            res.json(repData);
        }
    });
};

/**
 * 取得qr code
 */
civetController.getQrcode = function (req, res) {
    "use strict";
    civetClass.GetQrcode(function (err, repData) {
        var ajaxResult = new ajaxResultClass();
        if (err) {
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.json(ajaxResult);
        } else {
            // console.log(repData.cookieString);
            //返回cookie字串
            var civetCookie = cookiePakage.parse(repData.cookieString);
            // console.log(civetCookie);
            // console.log(civetCookie['ASP.NET_SessionId']);

            //把cookie存到session
            // res.header("set-cookie", repData.cookieString);
            req.session.civetQrcodeCookie = repData.cookieString;

            logUtil.info('QRCode URL：%s', repData.data);
            logUtil.info('QRCode Cookie：%s', repData.cookieString);

            ajaxResult.error = 0;
            ajaxResult.data = repData.data;
            ajaxResult.cookieString = repData.cookieString;
            res.json(ajaxResult);
        }
    });

};

/**
 * 監聽是否掃碼 From API
 */
civetController.scanFromAPI = function (req, res) {
    "use strict";
    // console.log(req.cookies);

    var id = req.params.id;
    civetClass.ScanFromAPI(id, function (err, repData) {
        var ajaxResult = new ajaxResultClass();

        if (err) {
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.send(ajaxResult);
        } else {
            res.json(repData);
        }
    });
};

/**
 * 監聽是否掃碼
 */
civetController.scan = function (req, res) {
    "use strict";
    var cookie = req.session.civetQrcodeCookie;
    logUtil.info('Scan Cookie：%s', cookie);

    civetClass.Scan(cookie, function (err, repData) {
        var ajaxResult = new ajaxResultClass();

        if (err) {
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.send(ajaxResult);
        } else {
            res.json(repData);
        }
    });

};

module.exports = civetController;