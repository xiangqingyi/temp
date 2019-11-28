var sysConfig = require('../../configs/sys.config');
var requestUtil = require('../../lib/RequestUtil');

var sys_ResetPassword = function (data) {
    this._id = data.objectId;
    this.collection = data.collection;
    this.function = data.function;
    this.action = data.action;
    this.other = data.other;
    this.ip = data.ip;
    this.createUserId = (data.createUserId == null ? '' : data.createUserId);
    this.createDateTime = data.createDateTime;
};

var queryFields = {
    _id: 1,
    userid: 1,
    name: 1,
    email: 1,
    tel: 1,
    photo: 1
};

sys_ResetPassword.reset = function (uuid, md5PWD, fn) {

    requestUtil.POST(sysConfig.API.host + sysConfig.API.url.account.resetPasswordByUser + '/' + md5PWD + '?_s=' + uuid, null, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            // var bodyClass = JSON.parse(body);
            // var weightingClass = new team_MontthScoreSummary(body);

            fn(null, body)
        } else {
            fn(error);
        }
    });
};

module.exports = sys_ResetPassword;