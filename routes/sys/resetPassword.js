var resetPasswordController = require('../../controllers/sys/resetPasswordController');

var express = require('express');
var muilter = require('../../lib/MulterUtil');
var router = express.Router();

//上傳檔案欄位名稱
var uploadFields = [{
    name: 'account_photo'
}];

router.get('/',resetPasswordController.entry);

//--------------------------------ajax---------------------------------

router.post('/reset',resetPasswordController.reset);

module.exports = router;