var renderObjClass = require('../../class/RenderObjClass');
var commonUtil = require('../../lib/CommonUtil');

var indexController = function(){};

/* GET home page. */
indexController.getIndexPage =  function(req, res, next) {
  "use strict";
  
  var renderObj = new renderObjClass();
  //選單
  commonUtil.setCurrentMenuActive(req.session.sys_userMenuList,null,null);
  renderObj.sidebarmenu.menuList = req.session.sys_userMenuList;
    
  res.render('index',renderObj);
};

/* GET home page. */
indexController.getIndexPage2 =  function(req, res, next) {
  "use strict";

  var renderObj = new renderObjClass();
  //選單
  commonUtil.setCurrentMenuActive(req.session.sys_userMenuList,null,null);
  renderObj.sidebarmenu.menuList = req.session.sys_userMenuList;
  
  res.render('index2',renderObj);
};

module.exports = indexController;