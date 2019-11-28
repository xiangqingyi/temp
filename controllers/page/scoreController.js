var url = require('url');

var loginClass = require('../../class/LoginClass');
var sessionUserInfoClass = require('../../class/SessionUserInfoClass');
var civetClass = require('../../class/civet/CivetClass');
var team_MonthScoreClass = require('../../class/team/MonthScoreClass');
var team_MonthScoreListClass = require('../../class/team/MonthScoreListClass');
var renderObjClass = require('../../class/RenderObjClass');
var ajaxResultClass = require('../../class/AjaxResultClass');
var sysConfig = require('../../configs/sys.config');

var requestUtil = require('../../lib/RequestUtil');
var logUtil = require('../../lib/loggerUtil');

var loginController = function () { };

/**
 * 登入帳號頁面
 */
loginController.entryLogin = function (req, res, next) {
    "use strict";
    //因請香信反向代理關係，網址都要重改，所以不用sso登入了
    // var urlQuery = url.parse(req.url).query;
    // res.redirect('/civetsso?'+urlQuery);
    // return; //改用SSO方式登入查詢成績，以下程式碼不再使用。

    //沒有指定日期就傳空值，會判定抓上個月的考績
    var yearSelected = (typeof req.params.year !== 'undefined') ? req.params.year : '';
    var monthSelected = (typeof req.params.month !== 'undefined') ? req.params.month : '';
    var renderObj = new renderObjClass();

    var errorlog = 0;
    try {
        logUtil.info('use score cinetUserInfo：%j', req.session.civetUserInfo);

        var id = '';
        if (typeof req.session.civetUserInfo !== 'undefined') {
            id = req.session.civetUserInfo.civetno.toUpperCase();
        }

        var accInfo = {
            "account": id
        };

        //瀏覽紀錄
        civetClass.saveLoginLog(accInfo, function (error, bodyResult) {
            team_MonthScoreListClass.getScoreInfoByIdFromAPI(id, id, yearSelected, monthSelected, function (err, monthScoreData) { //用id代替uuid
                var ajaxResult = new ajaxResultClass();

                if (typeof monthScoreData === 'undefined') {
                    errorlog = 12;
                    logUtil.error('取得個人分數資料返回undefined，ID：%s', id);
                    res.send('資料錯誤，無法取得訊息。' + errorlog);
                    return;
                }

                if (monthScoreData.length == 0) {
                    errorlog = 11;
                    logUtil.error('非法登入個人分數頁或回傳無資料，ID：%s', id);
                    renderObj.data.hasData = false;
                    res.render('pages/score', renderObj);
                    return;
                } else {
                    if (err) {
                        renderObj.data = null;
                        logUtil.error('用香信頻道查看個人成績Error：%s', err);
                        res.send(err);
                    } else {
                        renderObj.data = monthScoreData;
                        res.render('pages/score', renderObj);
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
 * 查看團隊成員成績
 */
loginController.entryTeamMember = function (req, res, next) {
    "use strict";
    //因請香信反向代理關係，網址都要重改，所以不用sso登入了
    // var urlQuery = url.parse(req.url).query;
    // res.redirect('/civetsso?'+urlQuery);
    // return; //改用SSO方式登入查詢成績，以下程式碼不再使用。

    var errorlog = 0;
    try {
        logUtil.info('use team cinetUserInfo：%j', req.session.civetUserInfo);

        var id = '';
        if (typeof req.session.civetUserInfo !== 'undefined') {
            id = req.session.civetUserInfo.civetno.toUpperCase();
        }

        // var accInfo = {"account" : id};

        // requestUtil.POSTUseJSON(sysConfig.API.host + sysConfig.API.url.monthscore.accessLog ,accInfo, function (error, response, body) {
        // });

        var renderObj = new renderObjClass();
        //取得年月
        var dt = new Date();
        var year = dt.getFullYear();
        var month = dt.getMonth() + 1;
        renderObj.year = year;
        renderObj.month = month;
        //取得團隊分數資料
        team_MonthScoreClass.getSearchListByIdFromAPI(id, id, year, month, function (err, monthScoreData) { //用id代替uuid
            // console.log(monthScoreData);
            if (typeof monthScoreData === 'undefined') {
                errorlog = 12;
                logUtil.error('取得團隊分數資料返回undefined，ID：%s', id);
                res.send('資料錯誤，無法取得訊息。' + errorlog);
                return;
            }

            if (monthScoreData.length == 0) {
                errorlog = 11;
                logUtil.error('非法登入團隊分數頁面或無資料，ID：%s', id);
                renderObj.title = '';
                renderObj.members = [];
                res.render('pages/teamscore', renderObj);
                return;
            } else {
                if (err) {
                    renderObj.data = null;
                    logUtil.error('用香信頻道查看團隊個人成績Error：%s', err);
                    res.send(err);
                } else {
                    renderObj.title = monthScoreData[0].teamName;
                    renderObj.members = monthScoreData;
                    // console.log(renderObj);

                    res.render('pages/teamscore', renderObj);
                }
            }
        });

    } catch (ex) {
        errorlog = 10;
        logUtil.error('scoreController error：%s', ex);
        res.send('資料錯誤，無法取得訊息。' + errorlog);
    }
};

/**
 * post帳號密碼
 */
loginController.postLogin = function (req, res, next) {
    "use strict";
    //TODO:check login    

    // var data = req.body.login;
    // loginClass.loginAccount(data,function(err,loginResult){
    //     var ajaxResult = new ajaxResultClass();
    //     // console.log('controller');
    //     // console.log(err);
    //     // console.log(loginResult);
    //
    //     if(err || typeof loginResult === 'undefined'){
    //         ajaxResult.error = 1;
    //         ajaxResult.message = 'server error';
    //         res.render('pages/login',ajaxResult);
    //         return;
    //     }else{
    //         if(loginResult.code != 0){
    //             ajaxResult.error = loginResult.code;
    //             ajaxResult.message = loginResult.message;
    //             res.render('pages/login',ajaxResult);
    //             return;
    //         }else{
    //             req.session.sessionUserInfo = new sessionUserInfoClass(loginResult.data.account);
    //             // req.session.userInfo = {
    //             //     _id:'58a3f6e9e84eaa1da4808b2b',
    //             //     account:'tla'
    //             // };
    res.redirect('/pages/score');
    //             return;
    //         }
    //     }
    // });
};

module.exports = loginController;