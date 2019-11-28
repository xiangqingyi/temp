var sysConfig = require('../../configs/sys.config');
var requestUtil = require('../../lib/RequestUtil');

var dateFormat = require('dateformat');

var sys_accountClass = require('../sys/AccountClass');

var project_Project = function (data) {
    this._id = data.objectId;
    this.name = data.name;
    if (data.startDate != undefined) {
        this.startDate = dateFormat(data.startDate, "isoDateTime").substr(0, 10);
    } else {
        this.endDate = null;
    }
    this.status = data.status;
    if (data.endDate != undefined) {
        this.endDate = dateFormat(data.endDate, "isoDateTime").substr(0, 10);
    } else {
        this.endDate = null;
    }
    this.memberNames = data.memberNames;
    this.pm = data.pm;
    this.statusText = data.statusText;
};

var queryFields = {
    _id: 1,
    name: 1,
    memberNames: 1
};

/**
 * 透過API依照id取得資料
 * @param id MongoDB _id
 * @param fn callback(err)
 * return callback(err)
 */
project_Project.getIdFromAPI = function (id, fn) {
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.project.getEditList + '/' + id,null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var bodyClass = JSON.parse(body);
            var projectClass = new project_Project(bodyClass);

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
project_Project.getListFromAPI = function (uuid, fn) {
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.project.getList + '?_s=' + uuid,null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var bodyClass = JSON.parse(body);
            var projectClass = [];
            bodyClass._embedded.projectInfoArray.forEach(function (row) {
                var temp = new project_Project(row);
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
 * 透過API取得列表資料
 * @param fn callback(err,result)
 * return callback(err,result)
 */
project_Project.getListByYearFromAPI = function (uuid, year, fn) {

    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.project.getByStartYear + year + '&_s=' + uuid,null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var bodyClass = JSON.parse(body);

            var projectClass = [];
            bodyClass._embedded.projectInfoArray.forEach(function (row) {
                var temp = new project_Project(row);
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
project_Project.saveHeadBodyDataFromAPI = function (uuid, reqParams, fn) {

    //TODO:checkReqParams

    // reqParams.createDateTime = new Date();
    var _project_ProjectModel = reqParams;

    requestUtil.POSTUseJSON(sysConfig.API.host + sysConfig.API.url.project.saveHeadBodyData + '?_s=' + uuid, _project_ProjectModel, function (error, response, body) {

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
project_Project.updateHeadBodyDataFromAPI = function (uuid, id, reqParams, fn) {

    //TODO:checkReqParams

    // var _project_ProjectModel = new project_Project(reqParams);
    var _project_ProjectModel = reqParams;

    requestUtil.PUTUseJSON(sysConfig.API.host + sysConfig.API.url.project.updateHeadBodyData + "/" + id + '?_s=' + uuid,_project_ProjectModel, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            // var bodyClass = JSON.parse(body);
            var projectClass = new project_Project(body);

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
project_Project.removeFromAPI = function (uuid, id, fn) {
    requestUtil.DELETE(sysConfig.API.host + sysConfig.API.url.project.deleteRow + "/" + id + '?_s=' + uuid, function (error, response, body) {
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
project_Project.closeFromAPI = function (uuid, id, fn) {
    requestUtil.POST(sysConfig.API.host + sysConfig.API.url.project.closeById + "/" + id + '?_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            fn(null)
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
project_Project.getIdBodyDataFromAPI = function (uuid, id, fn) {
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.project.getEditTableList + '/' + id+ '?_s=' + uuid,null, function (error, response, body) {

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

module.exports = project_Project;