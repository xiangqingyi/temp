var projectController = require('../../controllers/project/projectController');

var express = require('express');
var muilter = require('../../lib/MulterUtil');
var router = express.Router();

//上傳檔案欄位名稱
var uploadFields = [{
    name: 'account_photo'
}];

router.get('/',projectController.entry);

router.get('/add',projectController.entryAddPage);

router.get('/edit/:id',projectController.entryEditPage);

//--------------------------------ajax---------------------------------

/**
 * 新增單頭單身資料
 */
router.post('/addnewrow',projectController.addHeaderBodyRow);

/**
 * DataTables取編輯頁單身列表資料
 */
router.get('/editlist/:id',projectController.getEditBodyDataTableList);


/**
 * 列表頁DataTables取列表資料
 */
router.get('/list',projectController.getDataTableList);

/**
 * DataTables取列表資料
 */
router.get('/list/:year?',projectController.getDataTableListByYear);

/**
 * 透過key取得資料
 */
router.get('/:key',projectController.getByKey);


/**
 * 更新單頭單身資料
 */
router.post('/edit/:id',projectController.editHeaderBodyRow);

/**
 * 更新單頭單身資料
 */
router.post('/close/:id',projectController.closeProject);

/**
 * DataTables刪除Row
 */
router.delete('/del/:id',projectController.DelDataTableRow);

module.exports = router;