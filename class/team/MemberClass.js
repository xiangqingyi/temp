var sysConfig = require('../../configs/sys.config');
var requestUtil = require('../../lib/RequestUtil');

var sys_accountClass = require('../sys/AccountClass');

var team_Member = function (data) {
    this._id = data.id;
    this.name = data.name;
    this.leader = data.leader;
    this.members = data.members;
    this.status = data.status;
    this.memberNames = data.memberNames;
    this.createUserId = data.createUserId;
    this.createDateTime = data.createDateTime;
    this.updateUserId = data.updateUserId;
    this.updateDateTime = data.updateDateTime;
};

var queryFields = {
    _id: 1
};

/**
 * 透過API依照LeaderAccount取得TeamId
 * @param leaderAccount Account
 * @param fn callback(err,teamId)
 * return callback(err,teamId)
 */
team_Member.getTeamIdByLeaderAccountFromAPI = function (uuid, leaderAccount, fn) {
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.member.getTeamIdByLeader + '/findListByLeaderAccount?account=' + leaderAccount + '&_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body) // Show the HTML for the Google homepage.
            try {
                var bodyClass = JSON.parse(body);
                var teamMemberArray = bodyClass._embedded.teamMemberArray;
                var membersArryClass = [];
                if (bodyClass._embedded.teamMemberArray != null) {
                    bodyClass._embedded.teamMemberArray.forEach(function (row) {
                        var temp = new team_Member(row);
                        membersArryClass.push(temp);
                    });
                }

                fn(null, membersArryClass);
            } catch (err) {
                fn('無團隊資料讀。');
            }
        } else {
            fn(error);
        }
    });
};

/**
 * 透過API依照id取得資料
 * @param id MongoDB _id
 * @param fn callback(err)
 * return callback(err)
 */
team_Member.getIdFromAPI = function (uuid, id, fn) {
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.member.getEditList + '/' + id + '?_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body) // Show the HTML for the Google homepage.
            var bodyClass = JSON.parse(body);
            var memberClass = new team_Member(bodyClass);

            fn(null, memberClass);
        } else {
            fn(error);
        }
    });
};

/**
 * 透過API儲存單頭單身資料
 * @param reqParams post.bady資料
 * @param fn callback(err)
 * return callback(err)
 */
team_Member.saveHeadBodyDataFromAPI = function (uuid, reqParams, fn) {

    //TODO:checkReqParams

    // reqParams.createDateTime = new Date();
    var _team_MemberModel = reqParams;

    requestUtil.POSTUseJSON(sysConfig.API.host + sysConfig.API.url.member.saveHeadBodyData + '?_s=' + uuid, _team_MemberModel, function (error, response, body) {

        //新增成功回傳狀態碼為201 請求成功並建立資源
        if (!error && response.statusCode == 201) {
            fn(null)
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
team_Member.updateHeadBodyDataFromAPI = function (uuid, id, reqParams, fn) {

    //TODO:checkReqParams

    var _team_MemberModel = reqParams;

    requestUtil.PUTUseJSON(sysConfig.API.host + sysConfig.API.url.member.updateHeadBodyData + "/" + id + '?_s=' + uuid, _team_MemberModel, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            // var bodyClass = JSON.parse(body);
            var memberClass = null;
            if (typeof body !== 'undefined') {
                memberClass = new team_Member(body);
            }

            fn(null, memberClass)
        } else {
            fn(error || false);
        }
    });
};

/**
 * 透過API依照id取得單身資料
 * @param id MongoDB _id
 * @param fn callback(err)
 * return callback(err)
 */
team_Member.getIdBodyDataFromAPI = function (uuid, id, fn) {
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.member.getEditTableList + '/' + id + '?_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body) // Show the HTML for the Google homepage.
            var bodyClass = JSON.parse(body);
            var memberClass = [];
            if (bodyClass.members != null) {
                bodyClass.members.forEach(function (row) {
                    var temp = new sys_accountClass(row);
                    memberClass.push(temp);
                });
            }

            var result = {
                data: memberClass
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
team_Member.getListFromAPI = function (uuid, fn) {

    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.member.getList + '?_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body) // Show the HTML for the Google homepage.
            var bodyClass = JSON.parse(body);
            var memberClass = [];
            bodyClass._embedded.teamMemberArray.forEach(function (row) {
                var temp = new team_Member(row);
                memberClass.push(temp);
            });

            var result = {
                data: memberClass
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
team_Member.getSimpleListFromAPI = function (fn) {
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.member.getSimpleList, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var bodyClass = JSON.parse(body);
            var memberClass = [];
            bodyClass._embedded.teamMemberArray.forEach(function (row) {
                var temp = new team_Member(row);
                memberClass.push(temp);
            });

            fn(null, memberClass);
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
team_Member.saveDataFromAPI = function (uuid, reqParams, fn) {

    //TODO:checkReqParams

    reqParams.createDateTime = new Date();
    var _team_MemberModel = new team_Member(reqParams);

    requestUtil.POSTUseJSON(sysConfig.API.host + sysConfig.API.url.member.saveData + '?_s=' + uuid, _team_MemberModel, function (error, response, body) {
        //新增成功回傳狀態碼為201 請求成功並建立資源
        if (!error && response.statusCode == 201) {
            fn(null)
        } else {
            fn(error);
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
team_Member.updateFromAPI = function (uuid, id, reqParams, fn) {

    //TODO:checkReqParams

    reqParams.updateDateTime = new Date();
    var _team_MemberModel = new team_Member(reqParams);

    requestUtil.POSTUseJSON(sysConfig.API.host + sysConfig.API.url.member.updateRow + "/" + id + '?_s=' + uuid, _team_MemberModel, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            // var bodyClass = JSON.parse(body);
            var memberClass = new team_Member(body);

            fn(null, memberClass)
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
team_Member.removeFromAPI = function (uuid, id, fn) {
    requestUtil.DELETE(sysConfig.API.host + sysConfig.API.url.member.updateRow + "/" + id + '?_s=' + uuid, function (error, response, body) {
        //DELETE成功狀態碼回傳204 無資料
        if (!error && response.statusCode == 204) {
            fn(null)
        } else {
            fn(error);
        }
    });
};

module.exports = team_Member;