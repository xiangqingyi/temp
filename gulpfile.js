var gulp = require('gulp');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-clean-css');
var clean = require('gulp-clean');


/**
 * 預設執行位置，先執行完copy:filesall在執行start。
 */
gulp.task('default', ['copy:filesall'], function() {
    return gulp.start('jsmin','cssmin');
});

/**
 * 複製檔案，先執行完clean
 */
gulp.task('copy:filesall',['clean'], function(){
    //確認非同步執行，所以tast內要加入return返回stream
    return gulp.src([
        '**',
        '!.*',
        '!dist/**','!node_modules/**','!frontendjs/**','!logs*/**',
        '!gulpfile.js','!gulpfile-exsample.js','!*debug*','!webpack.config.js'
    ], {base: "."})
        .pipe(gulp.dest('dist/'));
});

/**
 * js壓縮
 */
gulp.task('jsmin', function() {    
    return gulp.src(['public/dist/**.js'], {base: "."})
            .pipe(uglify())
            .pipe(gulp.dest('dist/'));    
});

/**
 * css壓縮
 */
gulp.task('cssmin', function () {
    return gulp.src('public/dist/css/**.css', {base: "."})
        .pipe(cssmin())
        .pipe(gulp.dest('dist/'));
});

/**
 * 清理dist目錄
 */
gulp.task('clean', function() {  
  return gulp.src(['dist'], {base: ".",read: false})
    .pipe(clean());
});