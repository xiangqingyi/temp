var monthScoreQAController = require('../../controllers/team/monthScoreQAController');

var express = require('express');
var muilter = require('../../lib/MulterUtil');
var router = express.Router();


//上傳檔案欄位名稱
var uploadFields = [{
    name: 'account_photo'
}];

router.get('/',monthScoreQAController.entry);

router.get('/add',monthScoreQAController.entryAddPage);

/**
 * 有上傳檔案欄位時要使用 muilter.fieldsUpload(uploadFields) 方式上傳
 */
router.post('/add',monthScoreQAController.addNewRow);

router.get('/edit/:id',monthScoreQAController.entryEditPage);

//TODO:有上傳檔案欄位時要使用 muilter.fieldsUpload(uploadFields) 方式上傳，不然req.body取不到資料，修改的muilter的方式未實作
router.post('/edit/:id',monthScoreQAController.editOneRow);

//--------------------------------ajax---------------------------------

/**
 * DataTables取列表資料
 */
router.get('/list',monthScoreQAController.getDataTableList);

/**
 * DataTables刪除Row
 */
router.delete('/del/:id',monthScoreQAController.DelDataTableRow);

module.exports = router;