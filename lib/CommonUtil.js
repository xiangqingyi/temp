var encrypt = require('./EncryptUtil');

/**
 * 核對輸入密碼，正確時回傳密碼加密
 * @param pwd 密碼
 * @param pwd2 密碼2
 * return 
 */
exports.verifyPassword = function (pwd, pwd2) {
    if (pwd !== pwd2) {
        return false;
    } else {
        var md5PWD = encrypt.MD5(pwd);
        return md5PWD;
    }
};

/**
 * 設定menu目前點擊的位置
 * @param menuObjec menuObjec
 * @param mainCategory string 主選單Ename('management')
 * @param childCategory string 子選單Ename('account')
 * return 
 */
exports.setCurrentMenuActive = function (menuObjec, mainCategory,childCategory) {
    if(typeof mainCategory !== null){
        menuObjec.forEach(function(menus){
            if(menus.category1Ename == mainCategory){
                menus.categoryActive = 'active';
            }else{
                menus.categoryActive = '';            
            }
            if(typeof childCategory !== null){
                menus.childCategorys.forEach(function(childMenus){
                    if(childMenus.childEname == childCategory){
                        childMenus.childActive = 'active';
                    }else{
                        childMenus.childActive = '';
                    }
                });
            }
        });
    }
    return menuObjec;
};