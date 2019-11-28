var checkCivetUser = require('../../lib/middleware/CheckCivetUser');

var civetController = require('../../controllers/page/civetController');

var express = require('express');
var router = express.Router();

router.get('/', checkCivetUser, civetController.entryLogin);

router.get('/path/:gowhere?', checkCivetUser, civetController.entryLogin); 

router.get('/signin', civetController.signin);

// router.get('/signout',civetController.signout); 

//--------------------------------ajax---------------------------------

// router.post('/',civetController.postLogin);

router.get('/qrcode/', civetController.getQrcode);
router.get('/scan/', civetController.scan);

router.get('/qrcode/:id', civetController.getQrcodeFromAPI);
router.get('/scan/:id', civetController.scanFromAPI);

module.exports = router;