var url = require('url');

var logUtil = require('../loggerUtil');

module.exports = function (req, res, next) {
    "use strict";

    var nowUrl = url.parse(req.originalUrl);
    var isPrivilege = false;

    req.session.sys_userMenuList.forEach(function (mainMenus) {
        mainMenus.childCategorys.forEach(function (subMenus) {
            if (nowUrl.pathname.indexOf(subMenus.path) >= 0) {
                isPrivilege = true;
                return;
            }
        });
    });

    if (isPrivilege) {
        next();
    } else {
        logUtil.error('非法連線，使用者[%s] 無權限訪問url %s ', req.session.sessionUserInfo.account, req.originalUrl);
        
        //返回有權限的選單
        var path = (typeof req.session.sys_userMenuList[0].childCategorys[0].path !== 'undefined') ? req.session.sys_userMenuList[0].childCategorys[0].path : '/';        
        res.redirect(path);
    }
};