'use strict';
var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('test', ['jshint'], function () {
    return gulp.src('test.js', { cwd: './test', read: false }).pipe(mocha());
});
