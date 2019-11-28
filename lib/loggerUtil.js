var winston = require('winston');
require('winston-daily-rotate-file');

var fs = require( 'fs' );
var logDir = './logs';
var path = require('path');

if ( !fs.existsSync( logDir ) ) {
	fs.mkdirSync( logDir );
}

var loggerUtil = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            colorize: 'all',
            timestamp: true
        }),
        new (winston.transports.DailyRotateFile)({
            name: 'info-file',
            datePattern: 'yyyy-MM-dd.',
            prepend: true,   //日期在開頭
            filename: path.join(logDir,'/filelog-info.log'),
            timestamp:true,
            level: 'info'
        }),
        new (winston.transports.DailyRotateFile)({
            name: 'error-file',
            datePattern: 'yyyy-MM-dd.',
            prepend: true,   //日期在開頭
            filename: path.join(logDir,'/filelog-error.log'),
            timestamp:true,
            level: 'error'
        })
    ],
    exceptionHandlers: [
        new (winston.transports.File)({
            name: 'exceptions-file',
            filename: path.join(logDir,'/exceptions-file.log'),
            timestamp:true,
            humanReadableUnhandledException: true,
            json: true
        })        
    ]
  });

module.exports = loggerUtil;