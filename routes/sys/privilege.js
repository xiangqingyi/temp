var privilegeController = require('../../controllers/sys/privilegeController');

var express = require('express');
var muilter = require('../../lib/MulterUtil');
var router = express.Router();

//上傳檔案欄位名稱
var uploadFields = [{
    name: 'account_photo'
}];

router.get('/',privilegeController.entry);

router.get('/add',privilegeController.entryAddPage);

/**
 * 有上傳檔案欄位時要使用 muilter.fieldsUpload(uploadFields) 方式上傳
 */
router.post('/add',privilegeController.addNewRow);

router.get('/edit/:id',privilegeController.entryEditPage);

//TODO:有上傳檔案欄位時要使用 muilter.fieldsUpload(uploadFields) 方式上傳，不然req.body取不到資料，修改的muilter的方式未實作
router.post('/edit/:id',privilegeController.editOneRow);

//--------------------------------ajax---------------------------------

/**
 * DataTables取列表資料
 */
router.get('/list',privilegeController.getDataTableList);

/**
 * DataTables刪除Row
 */
router.delete('/del/:id',privilegeController.DelDataTableRow);

/**
 * 取得全部列表資料
 */
router.get('/wholelist',privilegeController.getWholeList);

module.exports = router;