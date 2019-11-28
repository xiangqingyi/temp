var multer=require('multer');

//預設檔案大小
var maxSize = 2 * 1024 * 1024;
//預設上船路徑
var UPLOAD_FOLDER = './public/uploads';
//預設附檔名
var FILE_EXT = [
    'image/pjpeg',
    'image/jpeg',
    'image/png',
    'image/x-png'
];

var storage = multer.diskStorage({
    //上傳後文件路徑
    destination: function (req, file, cb) {
        cb(null, UPLOAD_FOLDER);
    }, 
    //上傳後檔案名稱
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});  

var multerSetting = {
    storage: storage,
    limits: {
        fieldSize: maxSize
    },
    fileFilter: function (req, file, cb) {
        //副檔名判斷
        if (FILE_EXT.indexOf(file.mimetype) < 0 ){
            req.fileValidationError = '此檔案類型無法上傳!';
            return cb(null, false, new Error('I don\'t have a clue!'));
        }
        cb(null, true);
    }    
};

/**
 * 上傳檔案
 * @param fields 上傳檔案Name，[{name:'NAME'}]
 * return 
 */
exports.fieldsUpload = function(fields){
    var upload = multer(multerSetting).fields(fields);

    return function(req,res,next){
        upload(req,res,function(err){
            if(req.fileValidationError) {
                //TODO:目前無法回傳錯誤訊息
                res.locals.message = req.fileValidationError;
                res.redirect('back');
            }else{
                next();
            }    
        });
    };
};