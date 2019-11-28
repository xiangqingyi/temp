var crypto = require('crypto');
var config = require('../configs/sys.config');

var encryptUtil = function(){};

encryptUtil.Encrypt = function(type,key,data){
    var clearEncoding = 'utf8';
    var cipherEncoding = 'base64';    
    var cipherChunks = [];
    var cipher = crypto.createCipheriv(type, key, config.SYS.AES.IV);
    cipher.setAutoPadding(true);
    
    cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding));
    cipherChunks.push(cipher.final(cipherEncoding));

    return cipherChunks.join('');
};

encryptUtil.Decrypt = function(type,key,data){
    var clearEncoding = 'utf8';
    var cipherEncoding = 'base64';    
    var cipherChunks = [];
    var decipher = crypto.createDecipheriv(type, key, config.SYS.AES.IV);
    decipher.setAutoPadding(true);
    
    cipherChunks.push(decipher.update(data, cipherEncoding, clearEncoding));
    cipherChunks.push(decipher.final(clearEncoding));

    return cipherChunks.join('');
};

exports.AES256Utf8ToBase64Encrypt = function(data){
    return encryptUtil.Encrypt('aes-256-cbc',config.SYS.AES.KEY_256,data);
};

exports.AES256Base64ToUtf8Decrypt = function(data){
    return encryptUtil.Decrypt('aes-256-cbc',config.SYS.AES.KEY_256,data);
};

exports.AES128Utf8ToBase64Encrypt = function(data){
    return encryptUtil.Encrypt('aes-128-cbc',config.SYS.AES.KEY_128,data);
};

exports.AES128Base64ToUtf8Decrypt = function(data){
    return encryptUtil.Decrypt('aes-128-cbc',config.SYS.AES.KEY_128,data);
};

exports.MD5 = function(data){
    var cipher = crypto.createHash('md5');
    cipher.update(data);
    return cipher.digest('hex');
};