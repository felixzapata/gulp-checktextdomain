/*
 * gulp-checktextdomain
 * https://github.com/felixzapata/gulp-checktextdomain
 *
 * Copyright (c) 2016 Félix Zapata
 * Licensed under the ISC license.
 */


'use strict';

var fs = require('fs');
var path = require('path');
var moment = require('moment');
var R = require('ramda');
var through = require('through2');
var gutil = require('gulp-util');
var glob = require('glob-all');
var PLUGIN_NAME = 'gulp-checktextdomain';



function gulpCheckTextDomain(customOptions, cb) {
  
  var defaultOptions = {};
  
  
  var options = customOptions ? R.merge(defaultOptions, customOptions) : defaultOptions;

  function bufferContents(file, enc, cb) {
  
    if (file.isNull()) {
      cb(null, file);
      return;
    }
    
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME,  'Streaming not supported'));
      cb();
      return;
    }
    
    
    
    this.push(file);
    
    cb();
    
   
  }

  return through.obj(bufferContents, cb);

}

// Exporting the plugin main function
module.exports = gulpCheckTextDomain;