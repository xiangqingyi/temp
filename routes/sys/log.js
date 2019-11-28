var logController = require('../../controllers/sys/logController');

var express = require('express');
var muilter = require('../../lib/MulterUtil');
var router = express.Router();

//上傳檔案欄位名稱
var uploadFields = [{
    name: 'account_photo'
}];

router.get('/',logController.entry);

router.get('/add',logController.entryAddPage);

/**
 * 有上傳檔案欄位時要使用 muilter.fieldsUpload(uploadFields) 方式上傳
 */
router.post('/add',logController.addNewRow);

router.get('/edit/:id',logController.entryEditPage);

//TODO:有上傳檔案欄位時要使用 muilter.fieldsUpload(uploadFields) 方式上傳，不然req.body取不到資料，修改的muilter的方式未實作
router.post('/edit/:id',logController.editOneRow);

//--------------------------------ajax---------------------------------

/**
 * DataTables取列表資料
 */
router.get('/list',logController.getDataTableList);

/**
 * DataTables刪除Row
 */
router.delete('/del/:id',logController.DelDataTableRow);

module.exports = router;