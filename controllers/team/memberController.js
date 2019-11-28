var team_memberClass = require('../../class/team/MemberClass');
var sys_accountClass = require('../../class/sys/AccountClass');
var ajaxResultClass = require('../../class/AjaxResultClass');
var renderObjClass = require('../../class/RenderObjClass');
var fsUtil = require('../../lib/FsUtil');
var enumsUtil = require('../../lib/EnumsUtil');
var commonUtil = require('../../lib/CommonUtil');

var muilter = require('../../lib/MulterUtil');

var memberController = function(){};

//上傳檔案欄位名稱
var uploadFields = [{
    name: 'member_photo'
}];

/**
 * 帳號列表頁
 */
memberController.entry = function(req, res, next){
    "use strict";

    var renderObj = new renderObjClass();
    //選單
    commonUtil.setCurrentMenuActive(req.session.sys_userMenuList,'team','member');
    renderObj.sidebarmenu.menuList = req.session.sys_userMenuList;
    
    team_memberClass.getListFromAPI(req.session.sessionUUID,function(err,memberData){
        var ajaxResult = new ajaxResultClass();

        if(err){
            res.send(err);
        }else{
            renderObj.memberData = memberData;

            res.render('pages/team/member',renderObj);
        }  
    }); 

};

/**
 * 新增帳號頁面
 */
memberController.entryAddPage = function(req,res){
    "use strict";

    var renderObj = new renderObjClass();
    //選單
    commonUtil.setCurrentMenuActive(req.session.sys_userMenuList,'team','member');
    renderObj.sidebarmenu.menuList = req.session.sys_userMenuList;
    //頁面內容
    renderObj.pageinfo.pageTitle = '新增團隊管理';
    renderObj.pageinfo.titleDes = '新增資料';
    renderObj.pageinfo.tableTitle = '請輸入相關資料';
    renderObj.pageinfo.breadcrumb2ndTitle = '團隊管理';
    renderObj.pageinfo.breadcrumb2ndhref = '#';
    renderObj.pageinfo.breadcrumb3rdTitle = '團隊成員管理';
    renderObj.pageinfo.breadcrumb3rdhref = '#';
    //頁面狀態
    renderObj.pagestatus.type = 'add';
    renderObj.pagestatus.userID = req.session.sessionUserInfo.account;
    renderObj.pagestatus.TEAM_STATUS = enumsUtil.TEAM.STATUS;   //狀態
    renderObj.pagestatus.params.status = 1;//預設狀態是啟用

    res.render('pages/team/member_modify',renderObj);
};

/**
 * 新增帳號資料
 */
memberController.addNewRow = function(req,res){
    "use strict";

    var data = req.body.member;
    // //設定檔案上傳欄位
    // data = fsUtil.setSaveField(req,data);

    console.log(data);

    // team_memberClass.saveData(data,function(err){
    team_memberClass.saveDataFromAPI(req.session.sessionUUID,data,function(err){
        if(err){
            res.send(err);
        }else{
            res.redirect('/member');
        }
    });
};

/**
 * 編輯帳號頁面
 */
memberController.entryEditPage = function(req,res){
    var id = req.params.id;

    // team_memberClass.getId(id,function(err,memberData){
    team_memberClass.getIdFromAPI(req.session.sessionUUID,id,function(err,memberData){
        if(err){
            res.send(err);
        }else{
            memberData._id = id;
            if(!memberData._id){
                res.redirect('/');
            }else{

                var renderObj = new renderObjClass();
                //選單
                commonUtil.setCurrentMenuActive(req.session.sys_userMenuList,'team','member');
                renderObj.sidebarmenu.menuList = req.session.sys_userMenuList;
                //頁面內容
                renderObj.pageinfo.pageTitle = '編輯團隊管理';
                renderObj.pageinfo.titleDes = '編輯資料';
                renderObj.pageinfo.tableTitle = '請編輯相關資料';
                renderObj.pageinfo.breadcrumb2ndTitle = '團隊管理';
                renderObj.pageinfo.breadcrumb2ndhref = '#';
                renderObj.pageinfo.breadcrumb3rdTitle = '團隊成員管理';
                renderObj.pageinfo.breadcrumb3rdhref = '#';
                //頁面狀態
                renderObj.pagestatus.type = 'edit';
                renderObj.pagestatus.params = memberData;
                renderObj.pagestatus.TEAM_STATUS = enumsUtil.TEAM.STATUS;   //狀態

                res.render('pages/team/member_modify',renderObj);
                //res.json(memberData);    
            }            
        }
    });
};

/**
 * 編輯帳號資料
 */
memberController.editOneRow = function(req,res){
    var id = req.params.id;
    // team_memberClass.update(id,req.body.member,function(err,data){
    team_memberClass.updateFromAPI(req.session.sessionUUID,id,req.body.member,function(err,data){
        if(err){
            res.send(err);
        }else{
            res.redirect('/member');
        }        
    });
};

/**
 * DataTables取列表資料
*/
memberController.getDataTableList = function(req,res){
    "use strict";
    
    // team_memberClass.getList(function(err,memberData){
    team_memberClass.getListFromAPI(req.session.sessionUUID,function(err,memberData){
        var ajaxResult = new ajaxResultClass();

        if(err){
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.send(ajaxResult);
        }else{
            //console.log(JSON.stringify(memberData));                                
            //ajaxResult.error = 0; 因回傳值需固定格式，所以不用ajaxResult回傳
            res.json(memberData);
        }  
    });    
};

/**
 * DataTables取列表資料
 */
memberController.getSimpleDataTableList = function(req,res){
    "use strict";

    team_memberClass.getSimpleListFromAPI(function(err,memberData){
        var ajaxResult = new ajaxResultClass();
        if(err){
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.json(ajaxResult);
        }else{
            ajaxResult.error = 0;
            ajaxResult.data = memberData;
            res.json(ajaxResult);
        }
    });
};

/**
 * DataTables刪除Row
 */
memberController.DelDataTableRow = function(req,res){
    var id = req.params.id;

    team_memberClass.removeFromAPI(req.session.sessionUUID,id,function(err){
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
 * 新增團隊成員單頭單身資料
 */
memberController.addHeaderBodyRow = function (req, res) {
    "use strict";

    var data = req.body;
    var memberArray = [];

    // console.log(data);

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

    //組整個TeamMember資料，新增日期，新增ID，Server端會記錄，可不傳。
    var teamMemberClass = {
        name: data.form.name,
        status: data.form.status,
        members: memberArray
    };

    var leaderId = data.form.leaderId;



    sys_accountClass.getAccountFromAPIById(req.session.sessionUUID,leaderId,function(d) {
        if (d != null) {
            d.id = d._id;
        }
        
        teamMemberClass.leader = d;

        team_memberClass.saveHeadBodyDataFromAPI(req.session.sessionUUID,teamMemberClass, function (err) {
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

memberController.editHeaderBodyRow = function(req,res){
    var id = req.params.id;

    var data = req.body;
    var memberArray = [];

    console.log(data);

    if(typeof data.memberArray !== 'undefined'){
        data.memberArray.forEach(function(row){
            //server更新使用id非_id
            row.id = row._id;
            delete row._id;
            // row.createDateTime = new Date();
            memberArray.push(row);
        });
    }

    var leaderId = data.form.leaderId;

    sys_accountClass.getAccountFromAPIById(req.session.sessionUUID,leaderId,function(d) {
        if (d != null) {
            d.id = d._id;
        }

        var teamMemberClass = {
            name: data.form.name,
            status: data.form.status,
            leader:d,
            members: memberArray
        };
        team_memberClass.updateHeadBodyDataFromAPI(req.session.sessionUUID,id,teamMemberClass,function(err,data){
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
 * DataTables取編輯頁單身列表資料
 */
memberController.getEditBodyDataTableList = function(req,res){
    "use strict";
    var id = req.params.id;

    // sys_RoleClass.getList(function(err,roleData){
    team_memberClass.getIdBodyDataFromAPI(req.session.sessionUUID,id,function(err,roleData){
        var ajaxResult = new ajaxResultClass();

        if(err){
            ajaxResult.error = 1;
            ajaxResult.message = err;
            res.send(ajaxResult);
        }else{
            //console.log(JSON.stringify(roleData));
            //ajaxResult.error = 0; 因回傳值需固定格式，所以不用ajaxResult回傳
            res.json(roleData);
        }
    });
};

module.exports = memberController;