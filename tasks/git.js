'use strict';
var gulp = require('gulp');
var fs = require('fs');
var log = require('fancy-log');
var git = require('gulp-git');
var colors = require('ansi-colors');

function getPackageJSONVersion() {
  return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
}

gulp.task('commit-changes', function () {
  var version = getPackageJSONVersion();
  return gulp.src('./package.json')
    .pipe(git.add())
    .pipe(git.commit('chore(package.json): bump version ' + version));
});


gulp.task('commit-changelog', function () {
  var version = getPackageJSONVersion();
  return gulp.src('CHANGELOG.md')
    .pipe(git.add())
    .pipe(git.commit('docs(CHANGELOG.md): update CHANGELOG.md with version ' + version));
});


gulp.task('create-new-tag', function () {
  var version = getPackageJSONVersion();
  return git.tag(version, 'New version ' + version, function (error) {
    if (error) {
      log(colors.red(error));
    }
  });


});

gulp.task('git', gulp.series('commit-changelog', 'commit-changes', 'create-new-tag'));
