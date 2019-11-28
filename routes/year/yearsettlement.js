var settlementController = require('../../controllers/year/settlementController');

var express = require('express');
var muilter = require('../../lib/MulterUtil');
var router = express.Router();

//上傳檔案欄位名稱
var uploadFields = [{
    name: 'account_photo'
}];

router.get('/',settlementController.entry);

/**
 * 有上傳檔案欄位時要使用 muilter.fieldsUpload(uploadFields) 方式上傳
 */

router.get('/edit/:id',settlementController.entryEditPage);

router.put('/modifyrank/:id',settlementController.editOneRow);

//--------------------------------ajax---------------------------------

/**
 * DataTables取列表資料
 */
router.get('/list',settlementController.getDataTableList);

module.exports = router;