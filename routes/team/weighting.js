var weightingController = require('../../controllers/team/weightingController');

var express = require('express');
var muilter = require('../../lib/MulterUtil');
var router = express.Router();

//上傳檔案欄位名稱
var uploadFields = [{
    name: 'account_photo'
}];

router.get('/',weightingController.entry);

router.get('/add',weightingController.entryAddPage);

/**
 * 有上傳檔案欄位時要使用 muilter.fieldsUpload(uploadFields) 方式上傳
 */
router.post('/add',weightingController.addNewRow);

router.get('/edit/:id',weightingController.entryEditPage);

//TODO:有上傳檔案欄位時要使用 muilter.fieldsUpload(uploadFields) 方式上傳，不然req.body取不到資料，修改的muilter的方式未實作
router.post('/edit/:id',weightingController.editOneRow);

//--------------------------------ajax---------------------------------

/**
 * DataTables取列表資料
 */
router.get('/list/:year?',weightingController.getDataTableList);

/**
 * DataTables刪除Row
 */
router.delete('/del/:id',weightingController.DelDataTableRow);

router.post('/update/:id',weightingController.updateRow);


module.exports = router;