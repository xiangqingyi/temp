var monthScoreController = require('../../controllers/team/monthScoreController');

var express = require('express');
var muilter = require('../../lib/MulterUtil');
var router = express.Router();


//上傳檔案欄位名稱
var uploadFields = [{
    name: 'account_photo'
}];

router.get('/', monthScoreController.entry);

router.get('/:teamid/:year/:month',monthScoreController.entry);

router.get('/add', monthScoreController.entryAddPage);

/**
 * 有上傳檔案欄位時要使用 muilter.fieldsUpload(uploadFields) 方式上傳
 */
router.post('/add', monthScoreController.addNewRow);

router.get('/edit/:id', monthScoreController.entryEditPage);

//TODO:有上傳檔案欄位時要使用 muilter.fieldsUpload(uploadFields) 方式上傳，不然req.body取不到資料，修改的muilter的方式未實作
router.post('/edit/:id', monthScoreController.editOneRow);

//--------------------------------ajax---------------------------------

/**
 * 新增單身資料
 */
router.post('/addnewrow', monthScoreController.addBodyRow);

/**
 * 提交單身資料
 */
router.post('/submit/:teamId', monthScoreController.submitBodyRow);

/**
 * DataTables取列表資料
 */
router.get('/list/:teamId', monthScoreController.getDataTableList);

router.get('/list/:teamId/:year/:month', monthScoreController.getDataTableList);

/**
 * DataTables刪除Row
 */
router.delete('/del/:id', monthScoreController.DelDataTableRow);

module.exports = router;