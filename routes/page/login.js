var loginController = require('../../controllers/page/loginController');

var express = require('express');
var router = express.Router();


router.get('/',loginController.entryLogin);

router.get('/signout',loginController.signout);

//--------------------------------ajax---------------------------------

router.post('/',loginController.postLogin);

module.exports = router;