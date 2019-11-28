var report_reportClass = require('../../class/report/ReportClass');

var ajaxResultClass = require('../../class/AjaxResultClass');
var renderObjClass = require('../../class/RenderObjClass');
var fsUtil = require('../../lib/FsUtil');
var commonUtil = require('../../lib/CommonUtil');

var reportController = function(){};

//上傳檔案欄位名稱
var uploadFields = [{
    name: 'member_photo'
}];

reportController.list = function(req, res, next){
    "use strict";

    var renderObj = new renderObjClass();
    //選單
    commonUtil.setCurrentMenuActive(req.session.sys_userMenuList,'report','reporttotallist');
    renderObj.sidebarmenu.menuList = req.session.sys_userMenuList;

    res.render('pages/report/reporttotallist',renderObj);
};

reportController.chart = function(req, res, next){
    "use strict";

    var renderObj = new renderObjClass();
    //選單
    commonUtil.setCurrentMenuActive(req.session.sys_userMenuList,'report','reporttotalchart');
    renderObj.sidebarmenu.menuList = req.session.sys_userMenuList;

    res.render('pages/report/reporttotalchart',renderObj);
};

reportController.getListData = function(req,res){
    "use strict";

    var range = req.params.range;
    var start = req.params.start;
    var end = req.params.end;

    var accounts = req.body.accounts;
    var teams = req.body.teams;

    if (range == 'year') {

    } else if (range == 'month') {
        var sArray = start.split('-');
        var eArray = end.split('-');
        start = parseInt(sArray[0], 10) * 100 + parseInt(sArray[1], 10);
        end = parseInt(eArray[0], 10) * 100 + parseInt(eArray[1], 10);
    } else if (range == 'season') {
        var sArray = start.split('-');
        var eArray = end.split('-');
        start = parseInt(sArray[0],10) * 10 + Math.floor(parseInt(sArray[1],10)/4) + 1;
        end = parseInt(eArray[0],10) * 10 + Math.floor(parseInt(eArray[1],10)/4) + 1;
    }

    report_reportClass.getListDataFromAPI(range,start,end,accounts,teams,function(err,weightingData){
        var ajaxResult = new ajaxResultClass();

        if(err){
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.send(ajaxResult);
        }else{
            //console.log(JSON.stringify(weightingData));
            //ajaxResult.error = 0; 因回傳值需固定格式，所以不用ajaxResult回傳
            res.json(weightingData);
        }
    });
};

reportController.getChartData = function(req,res){
    "use strict";
    // team_WeightingClass.getList(function(err,weightingData){

    var range = req.params.range;
    var start = req.params.start;
    var end = req.params.end;

    var accounts = req.body.accounts;
    var teams = req.body.teams;

    if (range == 'year') {

    } else if (range == 'month') {
        var sArray = start.split('-');
        var eArray = end.split('-');
        start = parseInt(sArray[0], 10) * 100 + parseInt(sArray[1], 10);
        end = parseInt(eArray[0], 10) * 100 + parseInt(eArray[1], 10);
    } else if (range == 'season') {
        var sArray = start.split('-');
        var eArray = end.split('-');
        start = parseInt(sArray[0],10) * 10 + Math.floor(parseInt(sArray[1],10)/4) + 1;
        end = parseInt(eArray[0],10) * 10 + Math.floor(parseInt(eArray[1],10)/4) + 1;
    }
    report_reportClass.getChartDataFromAPI(range,start,end,accounts,teams,function(err,weightingData){
        var ajaxResult = new ajaxResultClass();
        if(err){
            ajaxResult.error = 1;
            ajaxResult.message = err;

            res.send(ajaxResult);
        }else{
            //console.log(JSON.stringify(weightingData));
            //ajaxResult.error = 0; 因回傳值需固定格式，所以不用ajaxResult回傳

            res.json(weightingData);
        }
    });
};

module.exports = reportController;