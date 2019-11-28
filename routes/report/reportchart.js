var reportController = require('../../controllers/report/reportController');

var express = require('express');
var router = express.Router();

//上傳檔案欄位名稱
var uploadFields = [{
    name: 'account_photo'
}];

router.get('/',reportController.chart);

//--------------------------------ajax---------------------------------

router.post('/list/:range/:start/:end',reportController.getChartData);

module.exports = router;