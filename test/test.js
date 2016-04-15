'use strict';

var pluginPath = '../index';
var checktextdomain = require(pluginPath);
var gulp = require('gulp');
var gutil = require('gulp-util');
var fs = require('fs-extra');
var path = require('path');
var should = require('should');
var assert = require('assert');
var sassert = require('stream-assert');
require('mocha');

var fixtures = function(glob) { return path.join(__dirname, './.tmp', glob); }


function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

describe('gulp-checktextdomain', function() {

  

  // We'll delete it when we're done.
  afterEach(function(done) {
    fs.remove(tmpFolder, done);
  });

  it('1) incorrect_domain_autocorrect', function(done) {
    

  });

  it('2) variable_domain_autocomplete', function(done) {
    
  });

  it('3) missing_domain', function(done) {
    


  });

  it('4) missing_domain_ignore_missing', function(done) {

   
  });
  
  it('5) correct_domain', function(done) {

   
  });
  
  it('6) plurals', function(done) {

   
  });

});
