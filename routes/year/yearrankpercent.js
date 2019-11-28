var rankPercentController = require('../../controllers/year/rankPercentController');

var express = require('express');
var router = express.Router();

//上傳檔案欄位名稱
var uploadFields = [{
    name: 'account_photo'
}];

router.get('/:year?',rankPercentController.entry);

//--------------------------------ajax---------------------------------

module.exports = router;