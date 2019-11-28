var memberController = require('../../controllers/team/memberController');

var express = require('express');
var muilter = require('../../lib/MulterUtil');
var router = express.Router();


//上傳檔案欄位名稱
var uploadFields = [{
    name: 'account_photo'
}];

router.get('/',memberController.entry);

router.get('/add',memberController.entryAddPage);

/**
 * 有上傳檔案欄位時要使用 muilter.fieldsUpload(uploadFields) 方式上傳
 */
router.post('/add',memberController.addNewRow);



router.get('/edit/:id',memberController.entryEditPage);

//TODO:有上傳檔案欄位時要使用 muilter.fieldsUpload(uploadFields) 方式上傳，不然req.body取不到資料，修改的muilter的方式未實作
// router.post('/edit/:id',memberController.editOneRow);

//--------------------------------ajax---------------------------------

/**
 * 新增單頭單身資料
 */
router.post('/addnewrow',memberController.addHeaderBodyRow);

/**
 * 更新單頭單身資料
 */
router.post('/edit/:id',memberController.editHeaderBodyRow);

/**
 * DataTables取編輯頁單身列表資料
 */
router.get('/editlist/:id',memberController.getEditBodyDataTableList);

/**
 * DataTables取列表資料
 */
router.get('/list',memberController.getDataTableList);

/**
 * DataTables取列表資料
 */
router.get('/simple/list',memberController.getSimpleDataTableList);

/**
 * DataTables刪除Row
 */
router.delete('/del/:id',memberController.DelDataTableRow);

module.exports = router;