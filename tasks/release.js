'use strict';
var gulp = require('gulp');
var runSequence = require('run-sequence');
var log = require('fancy-log');
var colors = require('ansi-colors');

function done(error) {
  if (error) {
    log(colors.red(error.message));
  } else {
    log(colors.green('Release finished successfully'));
  }

}

gulp.task('release:major', function (cb) {
  runSequence('test', 'bump:major', 'changelog', 'git', done);
});

gulp.task('release:minor', function (cb) {
  runSequence('test', 'bump:minor', 'changelog', 'git', done);
});

gulp.task('release:patch', function () {
  runSequence('test', 'bump:patch', 'changelog', 'git', done);
});