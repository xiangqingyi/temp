var accountController = require('../../controllers/sys/accountController');

var express = require('express');
var muilter = require('../../lib/MulterUtil');
var router = express.Router();

//上傳檔案欄位名稱
var uploadFields = [{
    name: 'account_photo'
}];

router.get('/',accountController.entry);

router.get('/add',accountController.entryAddPage);

/**
 * 有上傳檔案欄位時要使用 muilter.fieldsUpload(uploadFields) 方式上傳
 */
router.post('/add', muilter.fieldsUpload(uploadFields),accountController.addNewRow);

router.get('/edit/:id',accountController.entryEditPage);

// //TODO:有上傳檔案欄位時要使用 muilter.fieldsUpload(uploadFields) 方式上傳，不然req.body取不到資料，修改的muilter的方式未實作
// router.post('/edit/:id',muilter.fieldsUpload(uploadFields),accountController.editOneRow);

//--------------------------------ajax---------------------------------

/**
 * 新增單頭單身資料
 */
router.post('/addnewrow',accountController.addHeaderBodyRow);

/**
 * DataTables取列表資料
 */
router.get('/list',accountController.getDataTableList);

/**
 * 更新單頭單身資料
 */
router.post('/edit/:id',accountController.editHeaderBodyRow);

/**
 * 重置密碼
 */
router.post('/resetpwd/:id',accountController.resetPassword);

/**
 * DataTables取編輯頁單身列表資料
 */
router.get('/editlist/:id',accountController.getEditBodyDataTableList);

/**
 * DataTables刪除Row
 */
router.delete('/del/:id',accountController.DelDataTableRow);


/**
 * 取得PM資料
 */
router.get('/pmlist',accountController.getPMList);


/**
 * 取得全部列表資料
 */
router.get('/wholelist',accountController.getWholeList);

router.get('/listExcludeAdmin',accountController.getExcludeAdminList);

router.get('/pmlist',accountController.getPMList);

router.post('/check_account_exist',accountController.checkAccountExist);

module.exports = router;