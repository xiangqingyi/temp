var express = require('express');
var router = express.Router();

var scoreRoutes = require('./page/score');
var indexRoutes = require('./page/index');
var loginRoutes = require('./page/login');
var civetRoutes = require('./page/civet');
var accountRoutes = require('./sys/account');
var optionsRoutes = require('./sys/options');
var privilegeRoutes = require('./sys/privilege');
var roleRoutes = require('./sys/role');
var pagemangerRoutes = require('./sys/pagemanger');

var logRoutes = require('./sys/log');

var resetPasswordRoutes = require('./sys/resetPassword');

var memberRoutes = require('./team/member');
var monthScoreRoutes = require('./team/monthScore');
var monthScoreListRoutes = require('./team/monthScoreList');
var monthScoreSummaryRoutes = require('./team/monthScoreSummary');
var monthScoreQARoutes = require('./team/monthScoreQA');
var weightingRoutes = require('./team/weighting');
var memberaverageRoutes = require('./team/memberAverage');

var checkuser = require('../lib/middleware/CheckUser');
var checkUrlPrivilege = require('../lib/middleware/CheckUrlPrivilege');
var checkCivetUser = require('../lib/middleware/CheckCivetUser');

var projectRoutes = require('./project/project');
var projectScoreRoutes = require('./project/projectscore');

var yearRankPercentRoutes = require('./year/yearrankpercent');
var yearSettlementPercentRoutes = require('./year/yearsettlement');

var reportListRoutes = require('./report/reportlist');
var reportChartRoutes = require('./report/reportchart');

//與香信生活頻道串接
router.use('/score', checkCivetUser, scoreRoutes);
router.use('/civetsso', civetRoutes);


//登入
router.use('/login', loginRoutes);

//系統管理
router.use('/', checkuser, indexRoutes);
router.use('/privilege', checkuser, checkUrlPrivilege, privilegeRoutes);
router.use('/role', checkuser, checkUrlPrivilege, roleRoutes);
router.use('/account', checkuser, checkUrlPrivilege, accountRoutes);
router.use('/options', checkuser, checkUrlPrivilege, optionsRoutes);
router.use('/pagemanger', checkuser, checkUrlPrivilege, pagemangerRoutes);

router.use('/log', checkuser, checkUrlPrivilege, logRoutes);

router.use('/resetpassword', checkuser, checkUrlPrivilege, resetPasswordRoutes);

//團隊
router.use('/member', checkuser, checkUrlPrivilege, memberRoutes);
router.use('/monthscore', checkuser, checkUrlPrivilege, monthScoreRoutes);
router.use('/monthscorelist', checkuser, checkUrlPrivilege, monthScoreListRoutes);
router.use('/monthscoresummary', checkuser, checkUrlPrivilege, monthScoreSummaryRoutes);
router.use('/monthscoreqa', checkuser, checkUrlPrivilege, monthScoreQARoutes);
router.use('/weighting', checkuser, checkUrlPrivilege, weightingRoutes);
router.use('/memberaverage', checkuser, checkUrlPrivilege, memberaverageRoutes);

//特殊專案
router.use('/projectmanagement', checkuser, checkUrlPrivilege, projectRoutes);
router.use('/projectscore', checkuser, checkUrlPrivilege, projectScoreRoutes);

//年度
router.use('/yearrankpercent', checkuser, checkUrlPrivilege, yearRankPercentRoutes);

router.use('/yearsettlement', checkuser, checkUrlPrivilege, yearSettlementPercentRoutes);

// //報表
router.use('/reporttotallist', checkuser, checkUrlPrivilege, reportListRoutes);
//
// //報表
router.use('/reporttotalchart', checkuser, checkUrlPrivilege, reportChartRoutes);

module.exports = router;