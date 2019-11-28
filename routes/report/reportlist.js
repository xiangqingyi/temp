var reportController = require('../../controllers/report/reportController');

var express = require('express');
var router = express.Router();

//上傳檔案欄位名稱
var uploadFields = [{
    name: 'account_photo'
}];

router.get('/',reportController.list);

//--------------------------------ajax---------------------------------

router.post('/list/:range/:start/:end',reportController.getListData);

module.exports = router;