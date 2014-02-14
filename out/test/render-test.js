// Generated by CoffeeScript 1.6.3
(function() {
  var balUtil, cliPath, docpadPath, expect, expectPath, joe, nodePath, outPath, pathUtil, renderPath, rootPath, safefs, safeps;

  balUtil = require('bal-util');

  safefs = require('safefs');

  safeps = require('safeps');

  expect = require('chai').expect;

  joe = require('joe');

  pathUtil = require('path');

  docpadPath = pathUtil.join(__dirname, '..', '..');

  rootPath = pathUtil.join(docpadPath, 'test');

  renderPath = pathUtil.join(rootPath, 'render');

  outPath = pathUtil.join(rootPath, 'render-out');

  expectPath = pathUtil.join(rootPath, 'render-expected');

  cliPath = pathUtil.join(docpadPath, 'bin', 'docpad');

  nodePath = null;

  joe.suite('docpad-render', function(suite, test) {
    suite('files', function(suite, test) {
      var inputs;
      inputs = [
        {
          filename: 'markdown-with-extension.md',
          stdout: '*awesome*'
        }, {
          filename: 'markdown-with-extensions.html.md',
          stdout: '<p><em>awesome</em></p>'
        }
      ];
      return inputs.forEach(function(input) {
        return test(input.filename, function(done) {
          var command;
          command = [cliPath, 'render', pathUtil.join(renderPath, input.filename)];
          return safeps.spawnCommand('node', command, {
            cwd: rootPath,
            output: false
          }, function(err, stdout, stderr, code, signal) {
            var actual, expected;
            if (err) {
              return done(err);
            }
            expected = input.stdout;
            actual = stdout.trim();
            expect(actual).to.equal(expected);
            return done();
          });
        });
      });
    });
    return suite('stdin', function(suite, test) {
      var inputs;
      inputs = [
        {
          testname: 'markdown without extension',
          filename: '',
          stdin: '*awesome*',
          stdout: '*awesome*',
          error: 'Error: filename is required'
        }, {
          testname: 'markdown with extension as filename',
          filename: 'markdown',
          stdin: '*awesome*',
          stdout: '<p><em>awesome</em></p>'
        }, {
          testname: 'markdown with extension',
          filename: 'example.md',
          stdin: '*awesome*',
          stdout: '*awesome*'
        }, {
          testname: 'markdown with extensions',
          filename: '.html.md',
          stdin: '*awesome*',
          stdout: '<p><em>awesome</em></p>'
        }, {
          testname: 'markdown with filename',
          filename: 'example.html.md',
          stdin: '*awesome*',
          stdout: '<p><em>awesome</em></p>'
        }
      ];
      inputs.forEach(function(input) {
        return test(input.testname, function(done) {
          var command;
          command = [cliPath, 'render'];
          if (input.filename) {
            command.push(input.filename);
          }
          return safeps.spawnCommand('node', command, {
            stdin: input.stdin,
            cwd: rootPath,
            output: false
          }, function(err, stdout, stderr, code, signal) {
            if (err) {
              return done(err);
            }
            if (input.error && stdout.indexOf(input.error)) {
              return done();
            }
            expect(stdout.trim()).to.equal(input.stdout);
            return done();
          });
        });
      });
      return test('outPath', function(done) {
        var input;
        input = {
          "in": '*awesome*',
          out: '<p><em>awesome</em></p>',
          outPath: pathUtil.join(outPath, 'outpath-render.html')
        };
        return safeps.spawnCommand('node', [cliPath, 'render', 'markdown', '-o', input.outPath], {
          stdin: input["in"],
          cwd: rootPath,
          output: false
        }, function(err, stdout, stderr, code, signal) {
          if (err) {
            return done(err);
          }
          expect(stdout).to.equal('');
          return safefs.readFile(input.outPath, function(err, data) {
            var result;
            if (err) {
              return done(err);
            }
            result = data.toString();
            expect(result.trim()).to.equal(input.out);
            return done();
          });
        });
      });
    });
  });

}).call(this);
