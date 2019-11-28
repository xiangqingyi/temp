var config = require('../../configs/sys.config');
var requestUtil = require('../RequestUtil');
var logUtil = require('../loggerUtil');

var accessTokenClass = require('../../class/civet/AccessTokenClass');
var civetUserInfoClass = require('../../class/civet/CivetUserInfoClass');

module.exports = function (req, res, next) {
    "use strict";
    var civetCode = req.query.code;
    var errorcode = 0;    
    //取accesstoke
    if (typeof civetCode !== 'undefined' && civetCode != '') {
        //驗證accesstoken
        logUtil.info('驗證accesstoken');
        logUtil.info(config.CIVET.HOST + config.CIVET.URL.GET_ACCESS_TOKEN+ '?code=' + civetCode + '&appid=' + config.CIVET.APPID);
        requestUtil.GET(config.CIVET.HOST + config.CIVET.URL.GET_ACCESS_TOKEN+ '?code=' + civetCode + '&appid=' + config.CIVET.APPID,null, function (error, response, body) {
        // requestUtil.GET(config.API.host + '/test',null, function (error, response, body) {
            try {
                logUtil.info('%j',error);
                logUtil.info('%s',response.statusCode);
                logUtil.info('%s',body);
            } catch (ex) {
                errorcode = 4.1;
                logUtil.error(ex);
                res.send('連線逾時。' + errorcode);
                return;
            }
            if (!error && response.statusCode == 200) {
                try {
                    var bodyClass = JSON.parse(body);
                    var civet_accessToken = new accessTokenClass(bodyClass);
                    if (civet_accessToken.openid != '' && civet_accessToken.access_token != '') {
                        //取得訂閱用戶的資料
                        logUtil.info('取得訂閱用戶的資料');
                        logUtil.info(config.CIVET.HOST + config.CIVET.URL.GET_USERINFO, '?appid=' + config.CIVET.APPID + '&openid=' + civet_accessToken.openid + '&access_token=' + civet_accessToken.access_token);
                        requestUtil.GET(config.CIVET.HOST + config.CIVET.URL.GET_USERINFO+ '?appid=' + config.CIVET.APPID + '&openid=' + civet_accessToken.openid + '&access_token=' + civet_accessToken.access_token,null, function (error, response, body) {
                            try {                                
                                logUtil.info('%j',error);
                                logUtil.info('%s',response.statusCode);
                                logUtil.info('%s',body);
                            } catch (ex) {
                                errorcode = 2.1;
                                logUtil.error(ex);
                                res.send('連線逾時。' + errorcode);
                                return;
                            }
                            if (!error && response.statusCode == 200) {
                                try {
                                    var bodyClass = JSON.parse(body);
                                    var civet_civetUserInfoClass = new civetUserInfoClass(bodyClass);
                                    if (civet_civetUserInfoClass.civetno != '') {
                                        req.session.civetUserInfo = civet_civetUserInfoClass;
                                        next();
                                        return;
                                    } else {
                                        errorcode = 1;
                                        logUtil.error('用戶資料無civetno');
                                        res.send('資料錯誤，無法取得訊息。' + errorcode);
                                        return;
                                    }
                                } catch (ex) {
                                    errorcode = 6;
                                    logUtil.error(ex);
                                    res.send('資料錯誤，無法取得訊息。' + errorcode);
                                    return;
                                }
                            } else {
                                errorcode = 2;
                                logUtil.error('取得訂閱用戶的資料錯誤');
                                res.send('資料錯誤，無法取得訊息。' + errorcode);
                                return;
                            }
                        });
                    } else {
                        errorcode = 3;
                        logUtil.error('token無openid與access_token');
                        res.send('資料錯誤，無法取得訊息。' + errorcode);
                        return;
                    }
                } catch (ex) {
                    errorcode = 7;
                    logUtil.error(ex);
                    res.send('資料錯誤，無法取得訊息。' + errorcode);
                    return;
                }                  
            } else {
                errorcode = 4;
                logUtil.error('驗證accesstoken失敗');
                res.send('資料錯誤，無法取得訊息。' + errorcode);
                return;
            }
        });
    } else {
        errorcode = 5;
        logUtil.error('取accesstoken失敗');
        res.send('資料錯誤，無法取得訊息。' + errorcode);
        return;
    }
};