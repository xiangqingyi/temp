var indexController = require('../../controllers/page/indexController');

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/',indexController.getIndexPage);

router.get('/index2',indexController.getIndexPage2);

module.exports = router;
