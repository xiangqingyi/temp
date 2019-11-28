var roleController = require('../../controllers/sys/roleController');

var express = require('express');
var muilter = require('../../lib/MulterUtil');
var router = express.Router();

//上傳檔案欄位名稱
var uploadFields = [{
    name: 'account_photo'
}];

router.get('/',roleController.entry);

router.get('/add',roleController.entryAddPage);

router.get('/edit/:id',roleController.entryEditPage);

//--------------------------------ajax---------------------------------

/**
 * 新增單頭單身資料
 */
router.post('/addnewrow',roleController.addHeaderBodyRow);

/**
 * 列表頁DataTables取列表資料
 */
router.get('/list',roleController.getDataTableList);

/**
 * 更新單頭單身資料
 */
router.post('/edit/:id',roleController.editHeaderBodyRow);

/**
 * DataTables取編輯頁單身列表資料
 */
router.get('/editlist/:id',roleController.getEditBodyDataTableList);

/**
 * DataTables刪除Row
 */
router.delete('/del/:id',roleController.DelDataTableRow);

/**
 * 取得全部列表資料
 */
router.get('/wholelist',roleController.getWholeList);

module.exports = router;