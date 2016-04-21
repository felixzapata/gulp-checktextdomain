'use strict';

var pluginPath = '../index';
var checktextdomain = require(pluginPath);
var gulp = require('gulp');
var fs = require('fs-extra');
var path = require('path');
var should = require('should');
var assert = require('assert');
var sassert = require('stream-assert');
require('mocha');

var fixtures = function(glob) { return path.join(__dirname, './temp', glob); }

var keywords = [
  '__:1,2d',
  '_e:1,2d',
  '_x:1,2c,3d',
  'esc_html__:1,2d',
  'esc_html_e:1,2d',
  'esc_html_x:1,2c,3d',
  'esc_attr__:1,2d',
  'esc_attr_e:1,2d',
  'esc_attr_x:1,2c,3d',
  '_ex:1,2c,3d',
  '_n:1,2,4d',
  '_nx:1,2,4c,5d',
  '_n_noop:1,2,3d',
  '_nx_noop:1,2,3c,4d'
];


var fixtures = function(glob) { return path.join(__dirname, './temp', glob); }

function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

describe('gulp-checktextdomain', function() {

  var tmpFolder = path.join(__dirname, 'temp');

  beforeEach(function(done) {
    var folder = path.join(__dirname, './fixtures/');
    fs.copy(folder, tmpFolder, function(err) {
      done();
    });
  });

  // We'll delete it when we're done.
  afterEach(function(done) {
    fs.remove(tmpFolder, done);
  });


  it('1) Domain should have been corrected', function(done) {

    var actual;
    var corrected;
    var expected;
    var options = {
      force: true,
      text_domain: 'my-domain',
      correct_domain: true,
      create_report_file: true,
      keywords: keywords
    };

    gulp.src(fixtures('incorrect-domain-autocorrect.php'))
      .pipe(checktextdomain(options))
      .pipe(sassert.first(function(d) {
        //There are 14 missing domains
        actual = JSON.parse(fs.readFileSync('.incorrect-domain-autocorrect.json'));
        actual[path.join(__dirname, 'temp/incorrect-domain-autocorrect.php')].length.should.equal(14);

        //Test corrected file
        corrected = fs.readFileSync('test/temp/incorrect-domain-autocorrect.php').toString();
        expected = fs.readFileSync('test/expected/incorrect-domain-autocorrect.php').toString();
        corrected.should.equal(expected);

        //Clean up: Delete report file
        fs.remove('.incorrect-domain-autocorrect.json');
      }))
      .pipe(sassert.end(done));


  });

  it('2) Domain should have been corrected', function(done) {
    var actual;
    var corrected;
    var expected;
    var options = {
      force: true,
      text_domain: 'my-domain',
      correct_domain: true,
      create_report_file: true,
      keywords: keywords
    };

    gulp.src(fixtures('variable-domain-autocorrect.php'))
      .pipe(checktextdomain(options))
      .pipe(sassert.first(function(d) {
        //There are 14 missing domains
        actual = JSON.parse(fs.readFileSync('.variable-domain-autocorrect.json'));
        actual[path.join(__dirname, 'temp/variable-domain-autocorrect.php')].length.should.equal(14);

        //Test corrected file
        corrected = fs.readFileSync('test/temp/variable-domain-autocorrect.php').toString();
        expected = fs.readFileSync('test/expected/variable-domain-autocorrect.php').toString();
        corrected.should.equal(expected);

        //Clean up: Delete report file
        fs.remove('.variable-domain-autocorrect.json');
      }))
      .pipe(sassert.end(done));
  });

  it('3) Should detect missing domain', function(done) {
    var actual;
    var corrected;
    var expected;
    var options = {
      force: true,
      text_domain: 'my-domain',
      create_report_file: true,
      keywords: keywords
    };

    gulp.src(fixtures('missing-domain.php'))
      .pipe(checktextdomain(options))
      .pipe(sassert.first(function(d) {
        //There are 14 missing domains
        actual = JSON.parse(fs.readFileSync('.missing-domain.json'));
        actual[path.join(__dirname, 'temp/missing-domain.php')].length.should.equal(14);

        //Clean up: Delete report file
        fs.remove('.missing-domain.json');
      }))
      .pipe(sassert.end(done));


  });

  it('4) Should ignore one missing domain', function(done) {
    var actual;
    var corrected;
    var expected;
    var options = {
      force: true,
      text_domain: 'my-domain',
      report_missing: false,
      create_report_file: true,
      keywords: keywords
    };

    gulp.src(fixtures('missing-domain.php'))
      .pipe(checktextdomain(options))
      .pipe(sassert.first(function(d) {
        //File only has missing domain, which we are nor reporting. There should be no errors.
        actual = JSON.parse(fs.readFileSync('.missing-domain.json'));
        actual[path.join(__dirname, 'temp/missing-domain.php')].length.should.equal(0);

        //Clean up: Delete report file
        fs.remove('.missing-domain.json');
      }))
      .pipe(sassert.end(done));

  });

  it('5) Should review that the domain is ok', function(done) {
    var actual;
    var corrected;
    var expected;
    var options = {
      force: true,
      text_domain: 'my-domain',
      create_report_file: true,
      keywords: keywords
    };

    gulp.src(fixtures('correct-domain.php'))
      .pipe(checktextdomain(options))
      .pipe(sassert.first(function(d) {
        //File is correct, should report no errors
        actual = JSON.parse(fs.readFileSync('.correct-domain.json'));
        actual[path.join(__dirname, 'temp/correct-domain.php')].length.should.equal(0);

        //Clean up: Delete report file
        fs.remove('.correct-domain.json');
      }))
      .pipe(sassert.end(done));

  });

  it('6) Should review plurals', function(done) {
    var actual;
    var corrected;
    var expected;
    var options = {
      force: true,
      text_domain: 'my-domain',
      create_report_file: true,
      keywords: keywords
    };

    gulp.src(fixtures('plurals.php'))
      .pipe(checktextdomain(options))
      .pipe(sassert.first(function(d) {
        //File is correct, should report no errors
        actual = JSON.parse(fs.readFileSync('.plurals.json'));
        actual[path.join(__dirname, 'temp/plurals.php')].length.should.equal(0);

        //Clean up: Delete report file
        fs.remove('.plurals.json');
      }))
      .pipe(sassert.end(done));

  });

});
