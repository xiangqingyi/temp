var project_scoreClass = require('../../class/project/ProjectScoreClass');
var sys_accountClass = require('../../class/sys/AccountClass');
var ajaxResultClass = require('../../class/AjaxResultClass');
var renderObjClass = require('../../class/RenderObjClass');
var fsUtil = require('../../lib/FsUtil');
var commonUtil = require('../../lib/CommonUtil');

var muilter = require('../../lib/MulterUtil');

var projectScoreController = function(){};

//上傳檔案欄位名稱
var uploadFields = [{
    name: 'project_photo'
}];

/**
 * 系統參數列表頁
 */
projectScoreController.entry = function(req, res, next){
    "use strict";

    var id = req.params.id;

    var renderObj = new renderObjClass();
    //選單
    commonUtil.setCurrentMenuActive(req.session.sys_userMenuList,'project','projectscore');
    renderObj.sidebarmenu.menuList = req.session.sys_userMenuList;

    if (id != undefined) {
        renderObj.pagestatus.params.id = id;
    }

    console.info(renderObj.pagestatus.params);

    res.render('pages/project/projectscore',renderObj);
};

/**
 * 新增系統參數頁面
 */
projectScoreController.entryAddPage = function(req,res){
    "use strict";

    var renderObj = new renderObjClass();
    //選單
    commonUtil.setCurrentMenuActive(req.session.sys_userMenuList,'project','projectscore');
    renderObj.sidebarmenu.menuList = req.session.sys_userMenuList;
    //頁面內容
    renderObj.pageinfo.pageTitle = '專案評分';
    renderObj.pageinfo.titleDes = '專案評分';
    renderObj.pageinfo.tableTitle = '請輸入相關資料';
    renderObj.pageinfo.breadcrumb2ndTitle = '特殊專案';
    renderObj.pageinfo.breadcrumb2ndhref = '#';
    renderObj.pageinfo.breadcrumb3rdTitle = '專案評分';
    renderObj.pageinfo.breadcrumb3rdhref = '#';
    //頁面狀態
    renderObj.pagestatus.type = 'add';
    renderObj.pagestatus.userID = req.session.sessionUserInfo.account;

    res.render('pages/project/projectmanagement_modify',renderObj);
};

/**
 * 新增團隊成員單頭單身資料
 */
projectScoreController.addHeaderBodyRow = function (req, res) {
    "use strict";

    var data = req.body;
    var memberArray = [];

    if (typeof data.memberArray !== 'undefined') {
        data.memberArray.forEach(function (row) {
            row.createDateTime = new Date();
            row.createUserId = req.session.sessionUserInfo.account;
            //server更新使用id非_id
            row.id = row._id;
            delete row._id;
            memberArray.push(row);
        });
    }

    //組整個Member資料，新增日期，新增ID，Server端會記錄，可不傳。
    var teamMemberClass = {
        name: data.form.name,
        startDate: data.form.startDate,
        startYear: data.form.startDate.substr(0,4),
        members: memberArray
    };

    var pmId = data.form.pmId;



    sys_accountClass.getAccountFromAPIById(pmId,function(d) {
        if (d != null) {
            d.id = d._id;
        }

        var projectInfoClass = {
            name: data.form.name,
            pm:d,
            startDate: data.form.startDate,
            startYear: data.form.startDate.substr(0,4),
            members: memberArray,
            status:0
        };

        project_scoreClass.saveHeadBodyDataFromAPI(projectInfoClass, function (err) {
            var ajaxResult = new ajaxResultClass();

            if (err) {
                ajaxResult.error = 1;
                ajaxResult.message = err;
                res.json(ajaxResult);
                return;
            } else {
                ajaxResult.error = 0;
                ajaxResult.message = '';
                res.json(ajaxResult);
                return;
            }
        });
    });
};

/**
 * 編輯系統參數頁面
 */
projectScoreController.entryEditPage = function(req,res){
    var id = req.params.id;
    // project_scoreClass.getId(id,function(err,projectData){
    project_scoreClass.getIdFromAPI(id,function(err,projectData){
        if(err){
            res.send(err);
        }else{
            if(!projectData._id){
                res.redirect('/');
            }else{

                var renderObj = new renderObjClass();
                //選單
                commonUtil.setCurrentMenuActive(req.session.sys_userMenuList,'project','projectscore');
                renderObj.sidebarmenu.menuList = req.session.sys_userMenuList;
                //頁面內容
                renderObj.pageinfo.pageTitle = '編輯專案';
                renderObj.pageinfo.titleDes = '編輯資料';
                renderObj.pageinfo.tableTitle = '請編輯相關資料';
                renderObj.pageinfo.breadcrumb2ndTitle = '特殊專案';
                renderObj.pageinfo.breadcrumb2ndhref = '#';
                renderObj.pageinfo.breadcrumb3rdTitle = '專案評分';
                renderObj.pageinfo.breadcrumb3rdhref = '#';
                //頁面狀態
                renderObj.pagestatus.type = 'edit';
                renderObj.pagestatus.userID = req.session.sessionUserInfo.account;
                renderObj.pagestatus.params = projectData;

                res.render('pages/project/projectscore_modify',renderObj);
                //res.json(projectData);    
            }            
        }
    });
};

/**
 * DataTables取列表資料
*/
projectScoreController.getDataTableList = function(req,res){
    "use strict";
    
    // project_scoreClass.getList(function(err,projectData){
    project_scoreClass.getListFromAPI(function(err,projectData){
        var ajaxResult = new ajaxResultClass();

        if(err){
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.send(ajaxResult);
        }else{
            //console.log(JSON.stringify(projectData));                                
            //ajaxResult.error = 0; 因回傳值需固定格式，所以不用ajaxResult回傳
            res.json(projectData);
        }  
    });    
};

/**
 * 編輯系統參數單頭單身資料
 */
projectScoreController.editHeaderBodyRow = function(req,res){
    var id = req.params.id;

    var data = req.body;
    var memberArray = [];

    if(typeof data.memberArray !== 'undefined'){
        data.memberArray.forEach(function(row){
            //server更新使用id非_id
            row.id = row._id;
            delete row._id;
            // row.createDateTime = new Date();
            memberArray.push(row);
        });
    }

    var pmId = data.form.pmId;

    sys_accountClass.getAccountFromAPIById(pmId,function(d) {
        if (d != null) {
            d.id = d._id;
        }

        var projectClass = {
            name: data.form.name,
            startDate: data.form.startDate,
            pm:d,
            members: memberArray
        };
        project_scoreClass.updateHeadBodyDataFromAPI(id,projectClass,function(err,data){
            var ajaxResult = new ajaxResultClass();

            if(err || err==false){
                ajaxResult.error = 1;
                ajaxResult.message = err;
                res.json(ajaxResult);
                return;
            }else{
                ajaxResult.error = 0;
                ajaxResult.message = '';
                res.json(ajaxResult);
                return;
            }
        });
    });
};


/**
 * DataTables刪除Row
 */
projectScoreController.DelDataTableRow = function(req,res){
    var id = req.params.id;

    project_scoreClass.removeFromAPI(id,function(err){
        var ajaxResult = new ajaxResultClass();

        if(err){
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.json(ajaxResult);
        }else{
            ajaxResult.error = 0;
            res.json(ajaxResult);
        }
    }); 
};

projectScoreController.closeProject = function(req,res){
    "use strict";
    var id = req.params.id;

    console.log(id);

    project_scoreClass.closeFromAPI(id,function(err){
        var ajaxResult = new ajaxResultClass();

        if(err){
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.json(ajaxResult);
        }else{
            ajaxResult.error = 0;
            res.json(ajaxResult);
        }
    });
};

projectScoreController.giveScore = function(req,res){
    "use strict";
    var id = req.params.id;

    project_scoreClass.giveScoreFromAPI(id, req.body, function(err){
        var ajaxResult = new ajaxResultClass();

        if(err){
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.json(ajaxResult);
        }else{
            ajaxResult.error = 0;
            res.json(ajaxResult);
        }
    });
};

/**
 * getByKey
 */
projectScoreController.getById = function(req,res){
    var id = req.params.id;

    project_scoreClass.getById(id,function(err,projectData){
        var ajaxResult = new ajaxResultClass();
        if(err){
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.send(projectData);
        }else{
            //console.log(JSON.stringify(weightingData));
            //ajaxResult.error = 0; 因回傳值需固定格式，所以不用ajaxResult回傳
            res.json(projectData);
        }
    });
};

/**
 * DataTables取編輯頁單身列表資料
 */
projectScoreController.getEditBodyDataTableList = function(req,res){
    "use strict";
    var id = req.params.id;

    project_scoreClass.getIdBodyDataFromAPI(id,function(err,resData){
        var ajaxResult = new ajaxResultClass();

        if(err){
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.send(ajaxResult);
        }else{
            //console.log(JSON.stringify(roleData));
            //ajaxResult.error = 0; 因回傳值需固定格式，所以不用ajaxResult回傳
            res.json(resData);
        }
    });
};

module.exports = projectScoreController;