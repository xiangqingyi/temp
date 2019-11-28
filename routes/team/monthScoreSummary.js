var monthScoreSummaryController = require('../../controllers/team/monthScoreSummaryController');

var express = require('express');
var muilter = require('../../lib/MulterUtil');
var router = express.Router();

//上傳檔案欄位名稱
var uploadFields = [{
    name: 'account_photo'
}];

router.get('/',monthScoreSummaryController.entry);

//--------------------------------ajax---------------------------------

/**
 * DataTables取列表資料
 */
router.get('/list',monthScoreSummaryController.getDataTableList);

router.get('/list/:year/:month',monthScoreSummaryController.getDataTableList);


/**
 * 主管確認
 */
router.post('/managerconfirm',monthScoreSummaryController.managerConfirm);


/**
 * 主管提醒
 */
router.post('/alert',monthScoreSummaryController.alert);

/**
 * 主管退回
 */
router.post('/managerreject/:id',monthScoreSummaryController.managerReject);

/**
 * 成員通知
 */
router.post('/membernotify',monthScoreSummaryController.memberNotify);


/**
 * 導出Excel
 * */
router.get('/exportexcel/:year/:month',monthScoreSummaryController.exportexcel);

router.get('/:year/:month',monthScoreSummaryController.entry);

module.exports = router;