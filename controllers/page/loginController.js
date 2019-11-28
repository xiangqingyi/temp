var uuidV1 = require('uuid/v1');

var loginClass = require('../../class/LoginClass');
var sessionUserInfoClass = require('../../class/SessionUserInfoClass');
var ajaxResultClass = require('../../class/AjaxResultClass');

var logUtil = require('../../lib/loggerUtil');

var loginController = function () {};

/**
 * 登入帳號頁面
 */
loginController.entryLogin = function (req, res, next) {
    "use strict";

    if (req.session.sessionUserInfo != null) {
        res.redirect('back');
        return;
    } else {
        res.render('pages/login');
        return;
    }
};

/**
 * post帳號密碼
 */
loginController.postLogin = function (req, res, next) {
    "use strict";
    //TODO:check login    

    //登入時建立UUID
    req.session.sessionUUID = uuidV1();

    var data = req.body.form;
    loginClass.loginAccount(req.session.sessionUUID, data, function (err, loginResult) {
        var ajaxResult = new ajaxResultClass();
        // console.log('controller');
        // console.log(err);
        // console.log(loginResult);

        if (err || typeof loginResult === 'undefined') {
            ajaxResult.error = 1;
            ajaxResult.message = 'server error，請稍後再試。';
            // res.render('pages/login',ajaxResult);
            res.json(ajaxResult);
            return;
        } else {
            if (loginResult.code != 0) {
                ajaxResult.error = loginResult.code;
                ajaxResult.message = loginResult.message;
                // res.render('pages/login',ajaxResult);
                res.json(ajaxResult);
                return;
            } else {
                //驗證成功後dosomething                
                loginClass.loginSucessDoing(req.session.sessionUUID, req, loginResult, function (err, sucessResult) {
                    if (err) {
                        res.json(err);
                        logUtil.error('登入帳號密碼有問題。%s', err);
                    } else {
                        ajaxResult.error = 0;
                        res.json(ajaxResult);
                    }
                    return;
                });
            }
        }
    });
};

/**
 * 登出帳號
 */
loginController.signout = function (req, res, next) {
    "use strict";

    loginClass.logoutAccount(req.session.sessionUUID, function (err, loginResult) {
        var ajaxResult = new ajaxResultClass();
        // console.log('controller');
        // console.log(err);
        // console.log(loginResult);

        if (err || typeof loginResult === 'undefined') {
            logUtil.error(err);
        }

        //移除session
        req.session.sessionUserInfo = null;
        req.session.sys_optionsData = null;
        res.redirect('pages/login');
    });
};

module.exports = loginController;