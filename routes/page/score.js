var scoreController = require('../../controllers/page/scoreController');

var express = require('express');
var router = express.Router();


router.get('/team',scoreController.entryTeamMember);

router.get('/:year?/:month?',scoreController.entryLogin);

router.post('/',scoreController.postLogin);

module.exports = router;