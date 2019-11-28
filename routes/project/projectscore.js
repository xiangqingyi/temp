var projectScoreController = require('../../controllers/project/projectScoreController');

var express = require('express');
var muilter = require('../../lib/MulterUtil');
var router = express.Router();

//上傳檔案欄位名稱
var uploadFields = [{
    name: 'account_photo'
}];

router.get('/',projectScoreController.entry);

router.get('/give/:id',projectScoreController.entry);

router.get('/add',projectScoreController.entryAddPage);

router.get('/edit/:id',projectScoreController.entryEditPage);

//--------------------------------ajax---------------------------------

/**
 * 新增單頭單身資料
 */
router.post('/addnewrow',projectScoreController.addHeaderBodyRow);

/**
 * DataTables取編輯頁單身列表資料
 */
router.get('/editlist/:id',projectScoreController.getEditBodyDataTableList);


/**
 * 列表頁DataTables取列表資料
 */
router.get('/list',projectScoreController.getDataTableList);

/**
 * 透過key取得資料
 */
router.get('/:id',projectScoreController.getById);

/**
 * 更新單頭單身資料
 */
router.post('/edit/:id',projectScoreController.editHeaderBodyRow);

/**
 * 更新單頭單身資料
 */
router.post('/close/:id',projectScoreController.closeProject);

/**
 * 更新單頭單身資料
 */
router.put('/givescore/:id',projectScoreController.giveScore);

/**
 * DataTables刪除Row
 */
router.delete('/del/:id',projectScoreController.DelDataTableRow);

module.exports = router;