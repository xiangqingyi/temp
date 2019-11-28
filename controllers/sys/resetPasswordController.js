var sys_ResetPasswordClass = require('../../class/sys/ResetPasswordClass');
var ajaxResultClass = require('../../class/AjaxResultClass');
var renderObjClass = require('../../class/RenderObjClass');
var fsUtil = require('../../lib/FsUtil');
var commonUtil = require('../../lib/CommonUtil');
var encrypt = require('../../lib/EncryptUtil');

var muilter = require('../../lib/MulterUtil');

var resetPasswordController = function () {};

//上傳檔案欄位名稱
var uploadFields = [{
    name: 'resetPassword_photo'
}];

/**
 * 呈現頁
 */
resetPasswordController.entry = function (req, res, next) {
    "use strict";

    var renderObj = new renderObjClass();
    //選單
    commonUtil.setCurrentMenuActive(req.session.sys_userMenuList, 'management', 'resetpassword');
    renderObj.sidebarmenu.menuList = req.session.sys_userMenuList;

    res.render('pages/sys/resetpassword', renderObj);
};

/**
 * 重設密碼
 */
resetPasswordController.reset = function (req, res) {
    "use strict";
    var data = req.body;

    var md5PWD = encrypt.MD5(data.form.password_old);
    if (req.session.sessionUserInfo.password !== md5PWD) {
        var ajaxResult = new ajaxResultClass();
        ajaxResult.error = 1;
        ajaxResult.message = '舊密碼輸入不符合！';
        res.json(ajaxResult);
        return;
    }

    //密碼檢查
    md5PWD = commonUtil.verifyPassword(data.form.password, data.form.password2);
    if (md5PWD == false) {
        var ajaxResult = new ajaxResultClass();
        ajaxResult.error = 1;
        ajaxResult.message = '兩次密碼輸入不符合！';
        res.json(ajaxResult);
        return;
    }

    sys_ResetPasswordClass.reset(req.session.sessionUUID, md5PWD, function (err, data) {
        var ajaxResult = new ajaxResultClass();

        if (err) {
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.json(ajaxResult);
        } else {
            ajaxResult.error = 0;
            //移除session
            req.session.sessionUserInfo = null;
            req.session.sys_optionsData = null;
            res.json(ajaxResult);
        }
    });
};

module.exports = resetPasswordController;