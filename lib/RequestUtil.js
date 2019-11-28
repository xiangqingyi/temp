var request = require('request');
var logUtil = require('./loggerUtil');

var myRequest = function (requestOptions, fn) {
    if (typeof requestOptions.jar === 'undefined') {
        requestOptions.jar = true;
    }

    if (typeof requestOptions.timeout === 'undefined') {
        requestOptions.timeout = 8000;
    }
    request(requestOptions, function (error, response, body) {
        if (error) {
            if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKETTIMEDOUT') {
                logUtil.error('連線TimeOut。error：%j  url：%s', error, requestOptions.url);
                logUtil.error('設定回傳狀態為408');
                var temp = {
                    statusCode: 408
                };
                fn(error, temp, undefined);
                return;
            } else {
                logUtil.error('連線error：%j  url：%s', error, requestOptions.url);
            }
        }

        fn(error, response, body);
    });
};

exports.GET = function (url, query, fn) {
    var requestOptions = {
        method: 'GET',
        url: url
    };
    if (query != null) {
        requestOptions.qs = query;
    }

    myRequest(requestOptions, fn);
};

exports.GETWithCookie = function (url, query, cookieString, fn) {
    var requestOptions = {
        method: 'GET',
        // headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded',
        //     'Cookie':cookieString,
        // },
        url: url
    };
    if (query != null) {
        requestOptions.qs = query;
    }
    if (cookieString != null) {
        var j = request.jar();
        var cookie = request.cookie(cookieString);
        // console.log('request cookie:'+cookie);
        j.setCookie(cookie, url);
        requestOptions.jar = j;
    } else {
        requestOptions.jar = false;
    }

    myRequest(requestOptions, fn);
};

exports.POST = function (url, requestFrom, fn) {
    var requestOptions = {
        method: 'POST',
        url: url,
        form: requestFrom
    };

    myRequest(requestOptions, fn);
};

exports.POSTWithCookie = function (url, requestFrom, cookieString, fn) {
    var requestOptions = {
        method: 'POST',
        url: url,
        form: requestFrom
    };
    if (cookieString != null) {
        var j = request.jar();
        var cookie = request.cookie(cookieString);
        // console.log('request cookie:'+cookie);
        j.setCookie(cookie, url);
        requestOptions.jar = j;
    } else {
        requestOptions.jar = false;
    }

    myRequest(requestOptions, fn);
};

exports.DELETE = function (url, fn) {
    var requestOptions = {
        method: 'DELETE',
        url: url
    };

    myRequest(requestOptions, fn);
};

exports.POSTUseJSON = function (url, requestBody, fn) {
    var requestOptions = {
        method: 'POST',
        url: url,
        body: requestBody,
        json: true
    };

    myRequest(requestOptions, fn);
};

exports.POSTUseXML = function (url, requestBody, fn) {
    var requestOptions = {
        method: 'POST',
        url: url,
        body: requestBody,
        timeout: 30000,
        headers: { 'Content-Type': 'text/xml' }
    };

    myRequest(requestOptions, fn);
};

exports.PUTUseJSON = function (url, requestBody, fn) {
    var requestOptions = {
        method: 'PUT',
        url: url,
        body: requestBody,
        json: true
    };

    myRequest(requestOptions, fn);
};