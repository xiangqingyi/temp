var sessionUserInfoClass = require('../../class/SessionUserInfoClass');
var loginClass = require('../../class/LoginClass');
var logUtil = require('../loggerUtil');

module.exports = function(req,res,next){
    "use strict";
    
    if(req.session.sessionUserInfo == null){
        res.redirect('/login');
        return;
    }else{
        var sessionUserinfo = new sessionUserInfoClass(req.session.sessionUserInfo);
        
        //驗證userid
        loginClass.checkAccount(req.session.sessionUUID,sessionUserinfo.account,function(err,checkResult){
            if(err){
                logUtil.error('驗證userid錯誤。%s',err);
                req.session.sessionUserInfo = null;
                res.redirect('/login');
                return;                
            }else{
                if(typeof checkResult !== 'undefined'){
                    if(checkResult.code!=0){
                        logUtil.error('驗證userid失敗。code:%s',checkResult.code);                        
                        req.session.sessionUserInfo = null;
                        res.redirect('/login');
                        return;                
                    }else{
                        next(); 
                    }
                }else{
                    logUtil.error('驗證userid回傳結果undefined。');                        
                    req.session.sessionUserInfo = null;
                    res.redirect('/login');
                    return;                                    
                }
            }
        });
    }
};