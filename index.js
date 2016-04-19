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
var chalk = require('chalk');
var R = require('ramda');
var through = require('through2');
var gutil = require('gulp-util');
var table = require('text-table');
var checktextdomain = require('./checktextdomain.js');
var PLUGIN_NAME = 'gulp-checktextdomain';


function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

function gulpCheckTextDomain(customOptions, cb) {

  var defaultOptions = {
    keywords: false,
    text_domain: false,
    report_missing: true,
    report_variable_domain: true,
    correct_domain: false,
    create_report_file: false,
    force: false
  };

  var options = customOptions ? R.merge(defaultOptions, customOptions) : defaultOptions;
  var errors = [];
  var functions = []; //Array of gettext functions 
  var func_domain = {}; //Map of gettext function => ordinal number of domain argument
  var patt = new RegExp('([0-9]+)d', 'i');	//Check for domain identifier in keyword specification

  function bufferContents(file, enc, cb) {

    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported'));
      cb();
      return;
    }

    if (options.text_domain === false) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Text domain not provided.'));
      cb();
      return;
    }

    //Cast text_domain as an array to support multiple text domains
    options.text_domain = (options.text_domain instanceof Array) ? options.text_domain : [options.text_domain];

    //correct_domain can only be used if one domain is specified:
    options.correct_domain = options.correct_domain && (options.text_domain.length === 1);

    if (options.keywords === false) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'No keywords specified.'));
      cb();
      return;
    }

    options.keywords.forEach(function (keyword) {

      //parts[0] is keyword name, e.g. __ or _x
      var parts = keyword.split(':');
      var name = parts[0];
      var argument = 0;

      //keyword argument identifiers
      if (parts.length > 1) {
        var args = parts[1];
        var arg_parts = args.split(',');

        for (var j = 0; j < arg_parts.length; j++) {

          //check for domain identifier
          if (patt.test(arg_parts[j])) {
            argument = parseInt(patt.exec(arg_parts[j]), 10);
            break;
          }
        }

        //No domain identifier found, assume it is #ags + 1
        argument = argument ? argument : arg_parts.length + 1;

        //keyword has no argument identifiers -- assume text domain is 2nd argument
      } else {
        argument = 2;
      }

      func_domain[name] = argument;
      functions.push(name);
    });


    var all_errors = {};
    var error_num = 0;

    
    

    var modified_content = '';

    //Read file, if it exists
    
    var filepath = path.dirname(file.path);
    
    if (!fileExists(filepath)) {
      gutil.log('Source file "' + filepath + '" not found.');
      cb();
      return;
    }

    //Get tokens
    var tokens = checktextdomain.token_get_all(fs.readFileSync(filepath));

    //Init gettext_func - the current gettext function being inspected
    var gettext_func = {
      name: false, //The name of the gettext function
      line: false, //The line it occurs on
      domain: false, //The domain used with it (false if not found)
      argument: 0, //Ordinal argument number we are currently in
    };

    var parens_balance = 0; //Used to track parenthesis

    for (var i = 0, len = tokens.length; i < len; i++) {

      var token = tokens[i][0], text = tokens[i][1], line = tokens[i][2];

      var content = ('undefined' !== typeof tokens[i][1] ? tokens[i][1] : tokens[i][0]);

      //Look for T_STRING (function call )
      if (token === 306 && functions.indexOf(text) > -1) {

        gettext_func = {
          name: text,
          line: line,
          domain: false,
          argument: 0,
        };

        parens_balance = 0;

        //Check for T_CONSTANT_ENCAPSED_STRING - and that we are in the text-domain argument
      } else if (token === 314 && gettext_func.line && func_domain[gettext_func.name] === gettext_func.argument) {

        if (gettext_func.argument > 0) {
          gettext_func.domain = text.substr(1, text.length - 2);//get rid of quotes from beginning & end

          //Corect content
          if (options.correct_domain && gettext_func.domain !== options.text_domain[0]) {
            content = "'" + options.text_domain[0] + "'";
          }
        }

        //Check for variable - and that we are in the text-domain argument
      } else if (token === 308 && gettext_func.line && func_domain[gettext_func.name] === gettext_func.argument) {

        if (gettext_func.argument > 0) {
          gettext_func.domain = -1; //We don't know what the domain is )its a variable).

          //Corect content
          if (options.report_variable_domain && options.correct_domain) {
            content = "'" + options.text_domain[0] + "'";
          }
        }

        //Check for comma seperating arguments. Only interested in 'top level' where parens_balance == 1
      } else if (token === ',' && parens_balance === 1 && gettext_func.line) {
        gettext_func.argument++;

        //If we are an opening bracket, increment parens_balance
      } else if ('(' === token && gettext_func.line) {

        //If in gettext function and found opening parenthesis, we are at first argument
        if (gettext_func.argument === 0) {
          gettext_func.argument = 1;
        }

        parens_balance++;

        //If in gettext function and found closing parenthesis,
      } else if (')' === token && gettext_func.line) {
        parens_balance--;

        //If parenthesis match we have parsed all the function's arguments. Time to tally.
        if (gettext_func.line && 0 === parens_balance) {

          var error_type = false;

          if ((options.report_variable_domain && gettext_func.domain === -1)) {
            error_type = 'variable-domain';

          } else if (options.report_missing && !gettext_func.domain) {
            error_type = 'missing-domain';

          } else if (gettext_func.domain && gettext_func.domain !== -1 && options.text_domain.indexOf(gettext_func.domain) === -1) {
            error_type = 'incorrect-domain';

          }

          if (error_type) {
            errors.push(gettext_func);
          }

          //Reset gettext_func
          gettext_func = {
            name: false,
            line: false,
            domain: false,
            argument: 0,
          };
        }

      }

      modified_content += content;

    }

    //Output errors
    if (errors.length > 0) {

      gutil.log('\n' + chalk.bold.underline(file.src));

      var rows = [], error_line, func, message;
      for (i = 0, len = errors.length; i < len; i++) {

        error_line = chalk.yellow('[L<%= line %>]', { data: errors[i] });
        func = chalk.cyan(errors[i].name);

        if (!errors[i].domain) {
          message = chalk.red('Missing text domain');

        } else if (errors[i].domain === -1) {
          message = chalk.red('Variable used in domain argument');

        } else {
          message = chalk.red('Incorrect text domain used ("<%= domain %>")', { data: errors[i] });
        }

        rows.push([error_line, func, message]);
        error_num++;
      }

      console.log(table(rows));

      if (options.correct_domain) {
        fs.writeFileSync(filepath, modified_content);
        console.log(chalk.bold(filepath + ' corrected.'));
      }
    }

    all_errors[filepath] = errors;

    //Reset errors
    errors = [];
    


    if (options.create_report_file) {
      fs.writeFileSync('.' + this.target + '.json', JSON.stringify(all_errors));
    }

    if (error_num > 0 && !options.force) {
      console.log(error_num + ' problem' + (error_num === 1 ? '' : 's'), 6);
    } else if (error_num > 0) {
      console.log("\n" + chalk.red.bold('✖ ' + error_num + ' problem' + (error_num === 1 ? '' : 's')));
    } else {
      console.log("\n" + chalk.green.bold('✔ No problems') + "\n");
    }



    this.push(file);

    cb();


  }

  return through.obj(bufferContents, cb);

}

// Exporting the plugin main function
module.exports = gulpCheckTextDomain;