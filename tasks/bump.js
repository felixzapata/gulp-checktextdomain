'use strict';
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var bump = require('gulp-bump');
var log = require('fancy-log');


function doBump(type) {
  return function () {
    return gulp.src('./package.json')
      .pipe(bump(type).on('error', log.error))
      .pipe(gulp.dest('./'));
  };
}

gulp.task('bump:major', doBump({
  type: 'major'
}));

gulp.task('bump:minor', doBump({
  type: 'minor'
}));

gulp.task('bump:patch', doBump({
  type: 'patch'
}));
