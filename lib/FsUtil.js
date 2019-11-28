var fs = require('fs');

/**
 * 設定檔案上傳欄位
 * @param req 上傳檔案欄位req.files
 * @param data req.body.欄位
 * return data(增加data.files)
 */
exports.setSaveField = function(req,data){
    data.files = req.files;
    // uploadFields.forEach(function(field){
    //     data.files[field.name] = [];
    //     for(var key in req.files){
    //         data.files[field.name][key] = req.files[key];
    //     }
    // });

    return data;
};

/**
 * 從document中找尋檔案路徑，並同步刪除
 * @param adminData mongo回傳欄位
 * @param uploadFields 上傳檔案欄位名稱[{name:'NAME'}]
 */
exports.delFileForDocumnetSync = function(adminData,uploadFields){
    var photo = adminData.photo;    //資料庫中檔案欄位
    
    if (typeof photo !== "undefined") {    
        //從設定的上傳檔案欄位中尋找
        uploadFields.forEach(function(field){
            var files = photo[field.name];  //檔案陣列
            for(var key in files){
                var path = files[key].path;    
                fs.unlinkSync(path);
                // fs.unlink(path,function(err){
                //     if(err){
                //         //刪除失敗
                //         err = true;
                //     }else{
                //         //刪除成功
                //     }
                // });
            }
        });
    }
};