'use strict';
var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('test', gulp.series('jshint', function () {
    return gulp.src('test.js', { cwd: './test', read: false }).pipe(mocha());
}));
