var async = require('async');

var optionsClass = require('./sys/OptionsClass');
var menuClass = require('./sys/MenuClass');
var sessionUserInfoClass = require('./SessionUserInfoClass');
var ajaxResultClass = require('./AjaxResultClass');

var sysConfig = require('../configs/sys.config');
var requestUtil = require('../lib/RequestUtil');
var encrypUtil = require('../lib/EncryptUtil');
var logUtil = require('../lib/loggerUtil');

var loginClass = function (data) {
    this.account = data.account;
    this.password = data.password;
};

/**
 * 登入驗證
 */
loginClass.loginAccount = function (uuid, data, fn) {
    var fromModel = {
        uid: data.account,
        pwd: encrypUtil.MD5(data.password),
        t: Date.parse(new Date()) / 1000
    };
    //需要Urlencode再傳輸。超過30秒無效
    var encrypFromModel = encodeURIComponent(encrypUtil.AES128Utf8ToBase64Encrypt(JSON.stringify(fromModel)));

    requestUtil.POST(sysConfig.API.host + sysConfig.API.url.login.loginAccount + '?_s=' + uuid, encrypFromModel, function (error, response, body) {
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
 * 帳號驗證
 */
loginClass.checkAccount = function (uuid, account, fn) {
    var queryModel = {
        uid: account
    };

    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.login.checkAccount + '?_s=' + uuid, queryModel, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var bodyClass = JSON.parse(body);

            fn(null, bodyClass);
        } else {
            fn(error);
        }
    });
};

/**
 * 登出
 */
loginClass.logoutAccount = function (uuid, fn) {
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.logout.logoutAccount + '?_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var bodyClass = JSON.parse(body);

            fn(null, bodyClass);
        } else {
            fn(error);
        }
    });
};

/**
 * 帳號登入成功後做的事
 */
loginClass.loginSucessDoing = function (uuid, req, loginResult, fn) {
    var accountInfo = loginResult.data.account;
    logUtil.info('%s登入成功。', accountInfo.account);
    req.session.sessionUserInfo = new sessionUserInfoClass(accountInfo);
    req.session.sessionUserInfo.isHRmanager = loginResult.data.isHRmanager || 0;
    logUtil.info('%s session記錄成功。', req.session.sessionUserInfo.account);
    // req.session.userInfo = {
    //     _id:'58a3f6e9e84eaa1da4808b2b',
    //     account:'tla'
    // };

    async.parallel([
            function (callback) {
                //載入系統參數
                optionsClass.getListFromAPI(uuid, function (err, optionsData) {
                    var optionsResult = new ajaxResultClass();

                    if (err) {
                        optionsResult.error = 9;
                        optionsResult.message = err || '系統異常，請稍後再試。';
                        logUtil.error('取得系統參數錯誤。%s', err);
                        callback(optionsResult, optionsResult);

                    } else {
                        optionsResult.error = 0;
                        var tempClass = {};
                        optionsData.data.forEach(function (row) {
                            tempClass[row.key] = row;
                        });
                        req.session.sys_optionsData = tempClass;
                        callback(null, req.session.sys_optionsData);
                    }
                });
            },
            function (callback) {
                //載入選單
                menuClass.getUserMenuList(uuid, function (err, menuData) {
                    var menuListResult = new ajaxResultClass();

                    if (err || (typeof menuData === 'undefined')) {
                        menuListResult.error = 8;
                        menuListResult.message = err || '系統異常，請稍後再試。';
                        logUtil.error('載入選單錯誤。%s', err);
                        callback(menuListResult, menuListResult);

                    } else {
                        menuListResult.error = 0;
                        req.session.sys_userMenuList = menuData;
                        callback(null, req.session.sys_userMenuList);
                    }
                });
            }
        ],
        // optional callback
        function (err, asyncresult) {
            fn(err, asyncresult);
        });

};

module.exports = loginClass;