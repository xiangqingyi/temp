const async = require('async');

var sysConfig = require('../../configs/sys.config');
var requestUtil = require('../../lib/RequestUtil');
const civetUtil = require('../../lib/CivetUtil');
const logUtil = require('../../lib/loggerUtil');


var team_MonthScore = function (data) {
    this._id = data.objectId;
    this.teamId = data.teamId;
    this.teamName = data.teamName;
    this.memberId = data.memberId;
    this.memberName = data.memberName;
    this.memberScore = data.memberScore || 0;
    this.memberScoreRank = data.memberScoreRank || '';
    this.rankPosition = data.rankPosition;
    this.teamMemberCount = data.teamMemberCount;
    this.year = data.year;
    this.month = data.month;
    this.version = data.version || 1;
    this.leaderSubmit = data.leaderSubmit || false;
    this.managerConfirm = data.managerConfirm || false;
    this.createUserId = data.createUserId;
    this.createDateTime = data.createDateTime || new Date();
    this.updateUserId = data.updateUserId;
    this.updateDateTime = data.updateDateTime;
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
 * 透過API依照id取得資料
 * @param id MongoDB _id
 * @param fn callback(err)
 * return callback(err)
 */
team_MonthScore.getIdFromAPI = function (uuid, id, fn) {
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.monthscore.getEditList + '/' + id + '?_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body) // Show the HTML for the Google homepage.
            var bodyClass = JSON.parse(body);
            var monthScoreClass = new team_MonthScore(bodyClass);

            fn(null, monthScoreClass);
        } else {
            fn(error);
        }
    });
};

/**
 * 透過API取得列表資料
 * @param year 當年
 * @param month 當月
 * @param teamId teamId
 * @param fn callback(err,result)
 * return callback(err,result)
 */
team_MonthScore.getSearchListFromAPI = function (uuid, year, month, teamId, fn) {
    // //參數：?year=2017&month=1&teamId=58a3f6e9e84eaa1da4808b4e&memberScoreRank=1,2,3,4&sort=memberScore,desc
    // var queryString = {year:year,month:month,teamId:teamId,memberScoreRank:'1,2,3,4'};
    // requestUtil.GET(sysConfig.API.host + sysConfig.API.url.monthscore.getSearchList+'/findByYearAndMonthAndTeamId',queryString, function (error, response, body) {

    var pararLink = '/' + teamId;;
    if (year != '' && month != '') {
        pararLink = pararLink + '/' + year + '/' + month;
    }

    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.monthscore.getMonthScoreNewVersion + pararLink + '?_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            try {
                var rankPoint = [{
                    "key": 1,
                    "name": "A+",
                    "Lessthan": 95
                }, {
                    "key": 2,
                    "name": "A",
                    "Lessthan": 90
                }, {
                    "key": 3,
                    "name": "B",
                    "Lessthan": 80
                }, {
                    "key": 4,
                    "name": "C",
                    "Lessthan": 70
                }];
                var bodyClass = JSON.parse(body);
                var monthScoreClass = [];
                // bodyClass._embedded.teamMonthScoreArray.forEach(function (row) {
                bodyClass.forEach(function (row) {
                    var temp = new team_MonthScore(row);
                    //editor需要傳DT_RowId識別ID
                    temp.DT_RowId = temp._id;
                    rankPoint.forEach(function (rank) {
                        if (temp.memberScoreRank == rank.key) {
                            temp.memberScoreRank_display = rank.name;
                        }
                    });
                    monthScoreClass.push(temp);
                });

                var result = {
                    data: monthScoreClass
                };
                fn(null, result);

            } catch (err) {
                fn('err');
            }
        } else {
            fn('資料讀取失敗，請稍後再試。');
        }
    });
};

/**
 * 透過API取得列表資料
 * @param year 當年
 * @param month 當月
 * @param fn callback(err,result)
 * return callback(err,result)
 */
team_MonthScore.getSearchListByIdFromAPI = function (uuid, id, year, month, fn) {
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.monthscore.getMonthScoreNewVersionByAccount + '/' + id + '/' + year + '/' + month + '?_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var bodyClass = JSON.parse(body);
            var monthScoreClass = bodyClass;

            fn(null, monthScoreClass);
        } else {
            fn(error);
        }
    });
};

/**
 * 透過API儲存資料
 * @param reqParams post.bady資料
 * @param fn callback(err)
 * return callback(err)
 */
team_MonthScore.saveDataFromAPI = function (uuid, reqParams, fn) {

    //TODO:checkReqParams

    reqParams.createDateTime = new Date();
    var _team_MonthScoreModel = new team_MonthScore(reqParams);

    requestUtil.POSTUseJSON(sysConfig.API.host + sysConfig.API.url.monthscore.saveData + '?_s=' + uuid, _team_MonthScoreModel, function (error, response, body) {
        //新增成功回傳狀態碼為201 請求成功並建立資源
        if (!error && response.statusCode == 201) {
            fn(null)
        } else {
            fn(error);
        }
    });
};

/**
 * 透過API儲存單身資料
 * @param reqParams post.bady資料
 * @param fn callback(err)
 * return callback(err)
 */
team_MonthScore.saveBodyDataFromAPI = function (uuid, reqParams, fn) {

    // reqParams.createDateTime = new Date();
    var _team_MonthScoreModel = reqParams;

    requestUtil.POSTUseJSON(sysConfig.API.host + sysConfig.API.url.monthscore.saveBodyData + '?_s=' + uuid, _team_MonthScoreModel, function (error, response, body) {

        //新增成功回傳狀態碼為201 請求成功並建立資源
        if (!error && response.statusCode == 201) {
            fn(null)
        } else {
            fn(false);
        }
    });
};

/**
 * 透過API提交單身資料
 * @param teamId teamId
 * @param reqParams post.bady資料
 * @param fn callback(err)
 * return callback(err)
 */
team_MonthScore.submitBodyDataFromAPI = function (uuid, teamId, reqParams, fn) {

    // reqParams.createDateTime = new Date();
    var _team_MonthScoreModel = reqParams;

    requestUtil.POSTUseJSON(sysConfig.API.host + sysConfig.API.url.monthscore.submitBodyData + '/' + teamId + '?_s=' + uuid, _team_MonthScoreModel, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var monthScoreClass = new team_MonthScore(body);
            fn(null, monthScoreClass)
        } else {
            fn(false);
        }
    });
};

/**
 * 透過API修改資料
 * @param id _id
 * @param reqParams post.bady資料
 * @param fn callback(err,data)
 * return callback(err,data)
 */
team_MonthScore.updateFromAPI = function (uuid, id, reqParams, fn) {

    //TODO:checkReqParams

    reqParams.updateDateTime = new Date();
    var _team_MonthScoreModel = new team_MonthScore(reqParams);

    requestUtil.POSTUseJSON(sysConfig.API.host + sysConfig.API.url.monthscore.updateRow + "/" + id + '?_s=' + uuid, _team_MonthScoreModel, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            // var bodyClass = JSON.parse(body);
            var monthScoreClass = new team_MonthScore(body);

            fn(null, monthScoreClass)
        } else {
            fn(error);
        }
    });
};

/**
 * 透過API刪除資料
 * @param id _id
 * @param fn callback(err)
 * return callback(err)
 */
team_MonthScore.removeFromAPI = function (uuid, id, fn) {
    requestUtil.DELETE(sysConfig.API.host + sysConfig.API.url.monthscore.updateRow + "/" + id + '?_s=' + uuid, function (error, response, body) {
        //DELETE成功狀態碼回傳204 無資料
        if (!error && response.statusCode == 204) {
            fn(null)
        } else {
            fn(error);
        }
    });
};

/**
 * 透過API取得團長資料
 * @param fn callback(err,result)
 * return callback(err,result)
 */
team_MonthScore.getTeamLeaderListFromAPI = function (uuid, fn) {
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.monthscore.getTeamLeaderList + '?_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var bodyClass = JSON.parse(body);
            var teamLeaderClass = [];
            if (process.env.NODE_ENV != 'production') {
                teamLeaderClass = [{
                    account: '16502',
                    userName: '帥氣寶全'
                }, {
                    account: '22488',
                    userName: '林小金'
                }];
            } else {
                teamLeaderClass = bodyClass;
            }

            var result = teamLeaderClass;

            fn(null, result);
        } else {
            fn(error);
        }
    });
};

/**
 * 發送香信頻道通知
 * @param uuid uuid
 * @param fn callback(isSuccess, failList)
 * return callback(Boolean,errorMsg)
 */
team_MonthScore.sendNotificationToCivet = function (uuid, fn) {
    team_MonthScore.getTeamLeaderListFromAPI(uuid, function (err, teamLeaderResult) {
        if (err) {
            logUtil.error('取得團長資料有誤。Error：%s', err);
        } else {
            const civetObj = new civetUtil(sysConfig.CIVET.ACCOUNT, sysConfig.CIVET.PWD);
            let isSuccess = true;
            let failList = [];
            let tasks = [];
            try {
                teamLeaderResult.forEach(function (row) {
                    const civetNo = row.account;
                    let message = row.userName + ' 長官您好，請記得登入考績系統打當月份的成員考績，謝謝。';
                    //因非同步請求，所以先加到Promise中處理
                    let temp = new Promise(function (resolve, reject) {
                        civetObj.SendMsgToChannel(sysConfig.CIVET.HOST + sysConfig.CIVET.URL.POST_SENDMSG, civetNo, message, function (err, result) {
                            if (result == 'true') {
                                logUtil.info('%s %s 提醒成功。%s', civetNo, row.userName, new Date());
                            } else {
                                isSuccess = false;
                                failList.push(row);
                                logUtil.info('%s %s 提醒失敗。error：%s %s', civetNo, row.userName, result, new Date());
                            }
                            resolve(row);
                        });
                    });

                    tasks.push(temp);
                });

                Promise.all(tasks).then(function (results) {
                    // results.forEach(function(result){
                    //     console.log(result);
                    // });
                    fn(isSuccess, failList);
                }).catch(function (promiseErr) {
                    logUtil.error('提醒Promise error：%s %s', promiseErr, new Date());
                    fn(false, promiseErr);
                });

            } catch (error) {
                logUtil.error('提醒有錯誤。Error：%s', error);
            }
        }
    });
};

/**
 * 透過API取得已發布的團員資料
 * @param uuid uuid
 * @param teamId teamId
 * @param scoreMonth scoreMonth
 * @param fn callback(err,result)
 * return callback(err,result)
 */
team_MonthScore.getMemberListFromAPI = function (uuid, teamId, scoreMonth, fn) {
    requestUtil.POSTUseJSON(sysConfig.API.host + sysConfig.API.url.member.getManagerConfirmMemberList + '?_s=' + uuid, teamId, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // 因為接回來就是Array，所以不用JSON.parse
            var bodyClass = body;
            var ManagerConfirmMemberClass = [];
            if (process.env.NODE_ENV != 'production') {
                ManagerConfirmMemberClass = [{
                    account: '16502',
                    userName: '帥氣寶全'
                }, {
                    account: '22488',
                    userName: '林小金'
                }];
            } else {
                ManagerConfirmMemberClass = bodyClass;
            }

            var result = ManagerConfirmMemberClass;

            fn(null, result);
        } else {
            fn(error);
        }
    });
};

/**
 * 發送香信頻道通知給團員
 * @param uuid uuid
 * @param teamId teamId
 * @param scoreMonth scoreMonth
 * @param fn callback(isSuccess, failList)
 * return callback(Boolean,errorMsg)
 */
team_MonthScore.sendMemberNotificationToCivet = function (uuid, teamId, scoreMonth, fn) {
    var month = scoreMonth;
    team_MonthScore.getMemberListFromAPI(uuid, teamId, month, function (err, membersResult) {
        if (err) {
            logUtil.error('取得團員資料有誤。Error：%s', err);
        } else {
            const civetObj = new civetUtil(sysConfig.CIVET.ACCOUNT, sysConfig.CIVET.PWD);
            let isSuccess = true;
            let failList = [];
            let tasks = [];
            try {
                membersResult.forEach(function (row) {
                    const civetNo = row.account;
                    let year = new Date().getFullYear();
                    let hrefStr = "<a href='http://civetinterface.foxconn.com/Open/oauth/?to_code=pdssScoreSel," + year + "," + month + "'>點擊登入考績系統</a>";
                    let message = 'Dear ' + row.userName + ' 您好，' + month + '月考績已發布，請 ' + hrefStr + ' 查看，謝謝。';
                    //因非同步請求，所以先加到Promise中處理
                    let temp = new Promise(function (resolve, reject) {
                        civetObj.SendMsgToChannel(sysConfig.CIVET.HOST + sysConfig.CIVET.URL.POST_SENDMSG, civetNo, message, function (err, result) {
                            if (result == 'true') {
                                logUtil.info('%s %s 通知團員成功。%s', civetNo, row.userName, new Date());
                            } else {
                                isSuccess = false;
                                failList.push(row);
                                logUtil.info('%s %s 通知團員失敗。error：%s %s', civetNo, row.userName, result, new Date());
                            }
                            resolve(row);
                        });
                    });

                    tasks.push(temp);
                });

                Promise.all(tasks).then(function (results) {
                    // results.forEach(function(result){
                    //     console.log(result);
                    // });
                    fn(isSuccess, failList);
                }).catch(function (promiseErr) {
                    logUtil.error('提醒Promise error：%s %s', promiseErr, new Date());
                    fn(false, promiseErr);
                });

            } catch (error) {
                logUtil.error('提醒有錯誤。Error：%s', error);
            }
        }
    });
};

module.exports = team_MonthScore;