var year_rankpercentrClass = require('../../class/year/YearRankPercentClass');

var ajaxResultClass = require('../../class/AjaxResultClass');
var renderObjClass = require('../../class/RenderObjClass');
var fsUtil = require('../../lib/FsUtil');
var commonUtil = require('../../lib/CommonUtil');

var rankPercentController = function(){};

//上傳檔案欄位名稱
var uploadFields = [{
    name: 'member_photo'
}];

rankPercentController.entry = function(req, res, next){
    "use strict";

    var year = req.params.year;
    if (year == null || year == undefined) {
        year = new Date().getFullYear();
    }

    var renderObj = new renderObjClass();
    //選單
    commonUtil.setCurrentMenuActive(req.session.sys_userMenuList,'year','yearrankpercent');
    renderObj.sidebarmenu.menuList = req.session.sys_userMenuList;

    year_rankpercentrClass.getListFromAPI(year,function(err,rankPercent){
        var ajaxResult = new ajaxResultClass();

        if(err){
            res.send(err);
        }else{
            renderObj.pagestatus.params = rankPercent;

            res.render('pages/year/rankpercent',renderObj);
        }
    });
};

module.exports = rankPercentController;