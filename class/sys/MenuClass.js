var sysConfig = require('../../configs/sys.config');
var requestUtil = require('../../lib/RequestUtil');

var sys_Menu = function (data) {
    this.category1Name = data.category1Name;
    this.category1Ename = data.category1Ename;
    this.categoryIcon = data.categoryIcon;
    this.categoryActive = data.categoryActive;
    this.category1Order = data.category1Order;
    this.childCategorys = data.childCategorys || {
        childname: "",
        childEname: "",
        path: "",
        childActive: "",
        childOrder: 0
    };
};

sys_Menu.getUserMenuList = function (uuid, fn) {
    requestUtil.GET(sysConfig.API.host + sysConfig.API.url.sys.menu + '?_s=' + uuid, null, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var bodyClass = JSON.parse(body);
            // var menuClass = new sys_Menu(bodyClass);
            var menuClass = bodyClass;

            fn(null, menuClass);
        } else {
            fn(error);
        }
    });
};


module.exports = sys_Menu;