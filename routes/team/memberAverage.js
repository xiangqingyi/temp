var memberAverageController = require('../../controllers/team/memberAverageController');

var express = require('express');
var router = express.Router();

//上傳檔案欄位名稱
var uploadFields = [{
    name: 'account_photo'
}];

router.get('/',memberAverageController.list);

//--------------------------------ajax---------------------------------

router.post('/list/:range/:start/:end',memberAverageController.getListData);

module.exports = router;