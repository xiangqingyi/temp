var sysConfig = require('../../configs/sys.config');
var requestUtil = require('../../lib/RequestUtil');

var dateFormat = require('dateformat');

var sys_accountClass = require('../sys/AccountClass');

var project_Score = function (data) {
    this._id = data.objectId;
    this.scoreArray = data.scoreArray;
    this.members = data.members;
};

var ScoreData = function (userName,account,score) {
    this.userName = userName;
    this.account = account;
    this.score = score;
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
project_Score.getIdFromAPI = function (id, fn) {
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.project.getEditList + '/' + id,null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var bodyClass = JSON.parse(body);
            var projectClass = new project_Score(bodyClass);

            fn(null, projectClass);
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
project_Score.getListFromAPI = function (year,fn) {
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.project.getList ,null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var bodyClass = JSON.parse(body);
            var projectClass = [];
            bodyClass._embedded.projectInfoArray.forEach(function (row) {
                var temp = new project_Score(row);
                projectClass.push(temp);
            });

            var result = {
                data: projectClass
            };
            fn(null, result);
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
project_Score.saveHeadBodyDataFromAPI = function (reqParams, fn) {

    //TODO:checkReqParams

    // reqParams.createDateTime = new Date();
    var _project_ScoreModel = reqParams;

    requestUtil.POSTUseJSON(sysConfig.API.host + sysConfig.API.url.project.saveHeadBodyData, _project_ScoreModel, function (error, response, body) {

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
project_Score.updateHeadBodyDataFromAPI = function (id, reqParams, fn) {

    //TODO:checkReqParams

    // var _project_ScoreModel = new project_Score(reqParams);
    var _project_ScoreModel = reqParams;

    requestUtil.PUTUseJSON(sysConfig.API.host + sysConfig.API.url.project.updateHeadBodyData + "/" + id,_project_ScoreModel, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            // var bodyClass = JSON.parse(body);
            var projectClass = new project_Score(body);

            fn(null, projectClass)
        } else {
            fn(error || false);
        }
    });
};

/**
 * 透過API刪除資料
 * @param id _id
 * @param fn callback(err)
 * return callback(err)
 */
project_Score.removeFromAPI = function (id, fn) {
    requestUtil.DELETE(sysConfig.API.host + sysConfig.API.url.project.deleteRow + "/" + id, function (error, response, body) {
        //DELETE成功狀態碼回傳204 無資料
        if (!error && response.statusCode == 204) {
            fn(null)
        } else {
            fn(error);
        }
    });
};

/**
 * 透過API更新專案資料
 * @param id _id
 * @param fn callback(err)
 * return callback(err)
 */
project_Score.closeFromAPI = function (id, fn) {
    requestUtil.POST(sysConfig.API.host + sysConfig.API.url.project.closeById + "/" + id, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            fn(null)
        } else {
            fn(error);
        }
    });
};

project_Score.giveScoreFromAPI = function (id, body, fn) {
    requestUtil.PUTUseJSON(sysConfig.API.host + sysConfig.API.url.projectscore.giveScore + "/" + id, body.score, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            fn(null)
        } else {
            fn(error);
        }
    });
};

/**
 * 透過API更新專案資料
 * @param id _id
 * @param fn callback(err)
 * return callback(err)
 */
project_Score.getById = function (id, fn) {
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.projectscore.getById + "/" + id, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var bodyClass = JSON.parse(body);

            var scoreArray = [];
            try {
                if (bodyClass.scoreArray == undefined) {
                    bodyClass.members.forEach(function (row) {
                        var newEntity = new ScoreData (row.userName,row.account, 0);
                        scoreArray.push(newEntity);
                    });
                } else {
                    scoreArray = bodyClass.scoreArray;
                }
            } catch (err) {
                console.error(err);
            }

            var result = {
                data:scoreArray
            };

            fn(null, result)
        } else {
            fn(error);
        }
    });
};

/**
 * 透過API取得資料
 * @param key
 * @param fn callback(err)
 * return callback(err)
 project_Score.getByKey = function (key, fn) {
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.project.getByKey + key,null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var bodyClass = JSON.parse(body);
            var projectClass = new project_Score(bodyClass);
            fn(null, projectClass);
        } else {
            fn(error);
        }
    });
};

/**
 * 透過API依照id取得單身資料
 * @param id MongoDB _id
 * @param fn callback(err)
 * return callback(err)
 */
project_Score.getIdBodyDataFromAPI = function (id, fn) {
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.project.getEditTableList + '/' + id,null, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            var bodyClass = JSON.parse(body);
            var memberClass = [];
            if(bodyClass.members != null){
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

module.exports = project_Score;