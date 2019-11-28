var pagemangerController = require('../../controllers/sys/pagemangerController');

var express = require('express');
var muilter = require('../../lib/MulterUtil');
var router = express.Router();

//上傳檔案欄位名稱
var uploadFields = [{
    name: 'account_photo'
}];

router.get('/',pagemangerController.entry);

router.get('/add',pagemangerController.entryAddPage);

router.get('/edit/:id',pagemangerController.entryEditPage);

//--------------------------------ajax---------------------------------

/**
 * 新增單頭單身資料
 */
router.post('/addnewrow',pagemangerController.addHeaderBodyRow);

/**
 * 列表頁DataTables取列表資料
 */
router.get('/list',pagemangerController.getDataTableList);

/**
 * 更新單頭單身資料
 */
router.post('/edit/:id',pagemangerController.editHeaderBodyRow);

/**
 * DataTables取編輯頁單身列表資料
 */
router.get('/editlist/:id',pagemangerController.getEditBodyDataTableList);

/**
 * DataTables刪除Row
 */
router.delete('/del/:id',pagemangerController.DelDataTableRow);

module.exports = router;