var optionsController = require('../../controllers/sys/optionsController');

var express = require('express');
var muilter = require('../../lib/MulterUtil');
var router = express.Router();

//上傳檔案欄位名稱
var uploadFields = [{
    name: 'account_photo'
}];

router.get('/',optionsController.entry);

router.get('/add',optionsController.entryAddPage);

router.get('/edit/:id',optionsController.entryEditPage);

//--------------------------------ajax---------------------------------

/**
 * 新增單頭單身資料
 */
router.post('/addnewrow',optionsController.addHeaderBodyRow);

/**
 * 列表頁DataTables取列表資料
 */
router.get('/list',optionsController.getDataTableList);

/**
 * 透過key取得資料
 */
router.get('/:key',optionsController.getByKey);


/**
 * 更新單頭單身資料
 */
router.post('/edit/:id',optionsController.editHeaderBodyRow);

/**
 * DataTables刪除Row
 */
router.delete('/del/:id',optionsController.DelDataTableRow);

module.exports = router;