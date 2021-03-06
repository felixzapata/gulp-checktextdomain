'use strict';
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var stylish = require('jshint-stylish');
gulp.task('jshint', function() {
    var options = {
        lookup: true
    };
    return gulp.src([
            'gulpfile.js',
            'index.js',
            'test/test.js'
        ])
        .pipe($.jshint(options))
        .pipe($.jshint.reporter(stylish));
});
