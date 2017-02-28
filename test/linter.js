// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License in the project root for license information.

'use strict';
var _ = require('lodash'),
  execSync = require('child_process').execSync,
  utils = require('./util/utils');

describe('AutoRest Linter validation:', function () {
  var autoRestLocation = './AutoRest.*/tools/AutoRest.exe';
  let swaggersToProcess = utils.getFilesChangedInPR();
  _(swaggersToProcess).each(function (swagger) {
    it(swagger + ' should honor linter validation rules.', function (done) {
      var cmd = 'autorest -CodeGenerator None -I ' + swagger + ' -JsonValidationMessages true';
      console.log(`Executing: ${cmd}`);
      let resultString = '', resultObj = [];
      try {
        resultString = execSync(cmd, { encoding: 'utf8' });
      } catch (err) {
        if (err && err.stdout && !err.stderr) {
          resultString = err.stdout;
        } else {
          console.log(`An error occurred while running the linter on ${swagger}:`);
          //console.dir(err, { depth: null, colors: true });
          done(err);
        }
      }
      if (resultString) {
        resultString = resultString.trim().substring(resultString.indexOf('['));
      }
      try {
        resultObj = JSON.parse(resultString);
        console.dir(resultObj, {depth: null, colors: true});
      } catch (e) {
        console.log(`An error occurred while executing JSON.parse() on the linter output for ${swagger}:`);
        done(e);
      }
      done();
    });
  }).value();
});
