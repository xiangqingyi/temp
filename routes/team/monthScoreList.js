var monthScoreListController = require('../../controllers/team/monthScoreListController');

var express = require('express');
var muilter = require('../../lib/MulterUtil');
var router = express.Router();


//上傳檔案欄位名稱
var uploadFields = [{
    name: 'account_photo'
}];

router.get('/',monthScoreListController.entry);

router.get('/add',monthScoreListController.entryAddPage);

/**
 * 有上傳檔案欄位時要使用 muilter.fieldsUpload(uploadFields) 方式上傳
 */
router.post('/add',monthScoreListController.addNewRow);

router.get('/edit/:id',monthScoreListController.entryEditPage);

//TODO:有上傳檔案欄位時要使用 muilter.fieldsUpload(uploadFields) 方式上傳，不然req.body取不到資料，修改的muilter的方式未實作
router.post('/edit/:id',monthScoreListController.editOneRow);

router.get('/:teamid/:year/:month',monthScoreListController.entry);

//--------------------------------ajax---------------------------------

/**
 * DataTables取列表資料
 */
router.get('/list',monthScoreListController.getDataTableList);

router.get('/score',monthScoreListController.getScoreInfo);

/**
 * DataTables刪除Row
 */
router.delete('/del/:id',monthScoreListController.DelDataTableRow);

module.exports = router;