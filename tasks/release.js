'use strict';
var gulp = require('gulp');
gulp.task('release:major', gulp.series('test', 'bump:major', 'changelog', 'git'));
gulp.task('release:minor', gulp.series('test', 'bump:minor', 'changelog', 'git'));
gulp.task('release:patch', gulp.series('test', 'bump:patch', 'changelog', 'git'));