var sysConfig = require('../../configs/sys.config');
var sys_AccountModel = require('../../models/sys/accountModel');
var requestUtil = require('../../lib/RequestUtil');
var enumsUtil = require('../../lib/EnumsUtil');

var dateFormat = require('dateformat');

var sys_roldClass = require('./RoleClass');

var sys_Account = function (data) {
    this._id = data.objectId;
    this.account = data.account;
    this.password = data.password;
    this.needReset = data.needReset;
    this.userName = data.userName;
    this.status = data.status;
    this.position = data.position;
    this.createUserId = data.createUserId;
    this.createDateTime = data.createDateTime;
    this.updateUserId = data.updateUserId;
    this.updateDateTime = data.updateDateTime;

    if (data.birthday != undefined && data.birthday != null) {
        this.birthday = dateFormat(data.birthday, "isoDateTime").substr(0, 10);
    } else {
        this.birthday = null;
    }
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
 * 依照id取得資料
 * @param id MongoDB _id
 * @param fn callback(err)
 * return callback(err)
 */
sys_Account.getId = function (id, fn) {
    sys_AccountModel.findOne({
        '_id': id
    }, queryFields, function (err, sys_AccountData) {
        if (err) {
            fn(err);
        } else {
            fn(null, sys_AccountData);
        }
    });
};

/**
 * 透過API依照id取得資料
 * @param id MongoDB _id
 * @param fn callback(err)
 * return callback(err)
 */
sys_Account.getIdFromAPI = function (uuid, id, fn) {
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.account.getEditList + '/' + id + '?_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var bodyClass = JSON.parse(body);
            var accountClass = new sys_Account(bodyClass);

            fn(null, accountClass);
        } else {
            fn(error);
        }
    });
};

/**
 * 透過API依照id取得資料
 * @param id MongoDB _id
 * return callback(err)
 */
sys_Account.getAccountFromAPIById = function (uuid, id, fn) {
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.account.getEditList + '/' + id + '?_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var bodyClass = JSON.parse(body);
            var accountClass = new sys_Account(bodyClass);
            fn(accountClass)
        } else {
            fn(null)
        }
    });
};

/**
 * 透過API依照id取得單身資料
 * @param id MongoDB _id
 * @param fn callback(err)
 * return callback(err)
 */
sys_Account.getIdBodyDataFromAPI = function (uuid, id, fn) {
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.account.getEditTableList + '/' + id + '?_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body) // Show the HTML for the Google homepage.
            var bodyClass = JSON.parse(body);
            var accountRoleClass = [];
            if (bodyClass.roleArray != null) {
                bodyClass.roleArray.forEach(function (row) {
                    var temp = new sys_roldClass(row);
                    accountRoleClass.push(temp);
                });
            }

            var result = {
                data: accountRoleClass
            };

            fn(null, result);
        } else {
            fn(error);
        }
    });
};
/**
 * 取得列表資料
 * @param fn callback(err,result)
 * return callback(err,result)
 */
sys_Account.getList = function (fn) {

    //支援字串+空白與物件皆可
    //var fields = '-_id userid name';
    // var fields = {
    //     // _id:0,
    //     _id:1,
    //     userid:1,
    //     name:1,
    //     email:1,
    //     tel:1
    // };

    sys_AccountModel.find({}, queryFields, function (err, data) {
        var result = {
            data: data
        };
        if (err) {
            fn(err);
        } else {
            fn(null, result);
        }
    });
};

/**
 * 透過API取得列表資料
 * @param fn callback(err,result)
 * return callback(err,result)
 */
sys_Account.getListFromAPI = function (uuid, fn) {

    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.account.getList + '?_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body) // Show the HTML for the Google homepage.
            var bodyClass = JSON.parse(body);
            var accountClass = [];
            bodyClass._embedded.accountArray.forEach(function (row) {
                // var temp = {
                //     _id:row.objectId,
                //     account:row.account,
                //     userName:row.userName,
                //     status:row.status
                // };
                var temp = new sys_Account(row);
                //師位顯示欄位
                if (typeof temp.position !== "undefined" && temp.position != null) {
                    temp.position_display = enumsUtil.ACCOUNT.POSITION[temp.position];
                }
                //狀態顯示欄位
                if (typeof temp.status !== "undefined" && temp.status != null) {
                    temp.status_display = enumsUtil.ACCOUNT.STATUS[temp.status];
                }

                accountClass.push(temp);
            });

            var result = {
                data: accountClass
            };
            fn(null, result);
        } else {
            fn(error);
        }
    });
};

/**
 * 儲存資料
 * @param reqParams post.bady資料
 * @param fn callback(err)
 * return callback(err)
 */
sys_Account.saveData = function (reqParams, fn) {

    //TODO:checkReqParams

    var _sys_AccountModel = {
        userid: reqParams.userid,
        password: reqParams.password,
        name: reqParams.name,
        email: reqParams.email,
        tel: reqParams.tel,
        createdDate: Date(),
        modifyDate: ''
    };

    //插入上傳欄位
    var files = {};
    for (var key in reqParams.files) {
        files[key] = reqParams.files[key];
    }
    _sys_AccountModel.photo = files;

    sys_AccountModel.create(_sys_AccountModel, function (err) {
        if (err) {
            fn(err);
        } else {
            fn(null);
        }
    });
};

/**
 * 透過API儲存資料
 * @param reqParams post.bady資料
 * @param fn callback(err)
 * return callback(err)
 */
sys_Account.saveDataFromAPI = function (uuid, reqParams, fn) {

    //TODO:checkReqParams

    reqParams.createDateTime = new Date();
    var _sys_AccountModel = new sys_Account(reqParams);

    requestUtil.POSTUseJSON(sysConfig.API.host + sysConfig.API.url.account.saveData + '?_s=' + uuid, _sys_AccountModel, function (error, response, body) {
        //新增成功回傳狀態碼為201 請求成功並建立資源
        if (!error && response.statusCode == 201) {
            fn(null)
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
sys_Account.saveHeadBodyDataFromAPI = function (uuid, reqParams, fn) {

    //TODO:checkReqParams

    // reqParams.createDateTime = new Date();
    var _sys_AccountModel = reqParams;
    console.log(sysConfig.API.host + sysConfig.API.url.account.saveHeadBodyData + '?_s=' + uuid);
    requestUtil.POSTUseJSON(sysConfig.API.host + sysConfig.API.url.account.saveHeadBodyData + '?_s=' + uuid, _sys_AccountModel, function (error, response, body) {
        console.log(error);
        console.log(response.statusCode);
        console.log(body);
        //新增成功回傳狀態碼為201 請求成功並建立資源
        if (!error && response.statusCode == 201) {
            fn(null)
        } else {
            fn(false);
        }
    });
};

/**
 * 修改資料
 * @param id _id
 * @param reqParams post.bady資料
 * @param fn callback(err,data)
 * return callback(err,data)
 */
sys_Account.update = function (id, reqParams, fn) {

    //TODO:checkReqParams

    var _sys_AccountModel = {
        name: reqParams.name,
        email: reqParams.email,
        tel: reqParams.tel,
        modifyDate: Date()
    };

    sys_AccountModel.update({
        _id: id
    }, _sys_AccountModel, function (err, data) {
        if (err) {
            fn(err);
        } else {
            fn(null, data);
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
sys_Account.updateFromAPI = function (uuid, id, reqParams, fn) {

    //TODO:checkReqParams

    reqParams.updateDateTime = new Date();
    var _sys_AccountModel = new sys_Account(reqParams);

    requestUtil.PUTUseJSON(sysConfig.API.host + sysConfig.API.url.account.updateRow + "/" + id + '?_s=' + uuid, _sys_AccountModel, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            // var bodyClass = JSON.parse(body);
            var accountClass = new sys_Account(body);

            fn(null, accountClass)
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
sys_Account.updateHeadBodyDataFromAPI = function (uuid, id, reqParams, fn) {

    //TODO:checkReqParams

    var _sys_AccountModel = reqParams;

    requestUtil.PUTUseJSON(sysConfig.API.host + sysConfig.API.url.account.updateHeadBodyData + "/" + id + '?_s=' + uuid, _sys_AccountModel, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            // var bodyClass = JSON.parse(body);
            var accountClass = null;
            if (typeof body !== 'undefined') {
                accountClass = new sys_Account(body);
            }

            fn(null, accountClass)
        } else {
            fn(error || false);
        }
    });
};

/**
 * 重置密碼
 * @param id _id
 * @param fn callback(err,data)
 * return callback(err,data)
 */
sys_Account.resetPasswordFromAPI = function (uuid, id, fn) {
    requestUtil.POST(sysConfig.API.host + sysConfig.API.url.account.resetPassword + "/" + id + '?_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // var bodyClass = JSON.parse(body);
            // var weightingClass = new team_MontthScoreSummary(body);

            fn(null, body)
        } else {
            fn(error);
        }
    });
};



/**
 * 刪除資料
 * @param id _id
 * @param fn callback(err)
 * return callback(err)
 */
sys_Account.remove = function (id, fn) {
    sys_AccountModel.remove({
        _id: id
    }, function (err) {
        if (err) {
            fn(err);
        } else {
            fn(null);
        }
    });
};

/**
 * 刪除資料
 * @param id _id
 * @param fn callback(err)
 * return callback(err)
 */
sys_Account.removeFromAPI = function (uuid, id, fn) {
    requestUtil.DELETE(sysConfig.API.host + sysConfig.API.url.account.deleteRow + "/" + id + '?_s=' + uuid, function (error, response, body) {
        //DELETE成功狀態碼回傳204 無資料
        if (!error && response.statusCode == 204) {
            fn(null)
        } else {
            fn(error);
        }
    });
};

/**
 * 透過API取得全部列表資料
 * @param fn callback(err,result)
 * return callback(err,result)
 */
sys_Account.getWholeListFromAPI = function (uuid, fn) {

    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.account.getList + '?_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var bodyClass = JSON.parse(body);
            var roleClass = [];
            bodyClass._embedded.accountArray.forEach(function (row) {
                var temp = new sys_Account(row);
                roleClass.push(temp);
            });

            fn(null, roleClass);
        } else {
            fn(error || flase);
        }
    });
};

sys_Account.getExcludeAdminListFromAPI = function (uuid, fn) {

    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.account.getList + '?_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var bodyClass = JSON.parse(body);
            var roleClass = [];
            bodyClass._embedded.accountArray.forEach(function (row) {
                var temp = new sys_Account(row);
                if (temp.account == 'superadmin' || temp.account == 'admin') { } else {
                    roleClass.push(temp);
                }
            });

            fn(null, roleClass);
        } else {
            fn(error || flase);
        }
    });
};

/**
 * 透過API取得PM列表資料
 * @param fn callback(err,result)
 * return callback(err,result)
 */
sys_Account.getPMListFromAPI = function (uuid, fn) {
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.account.getPMList + '?_s=' + uuid, null, function (error, response, body) {
        console.log(response.statusCode);
        if (!error && response.statusCode == 200) {
            console.log(body);

            var bodyClass = JSON.parse(body);
            var roleClass = [];
            bodyClass._embedded.accountArray.forEach(function (row) {
                var temp = new sys_Account(row);
                roleClass.push(temp);
            });

            fn(null, roleClass);
        } else {
            fn(error || flase);
        }
    });
};

sys_Account.checkAccountExist = function (account, uuid, fn) {
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.account.checkAccountExist + account + '&_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            fn(null, body);
        } else {
            fn(error || flase);
        }
    });
};

module.exports = sys_Account;