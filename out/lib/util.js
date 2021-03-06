// Generated by CoffeeScript 1.6.3
(function() {
  var TaskGroup, docpadUtil, extractOptsAndCallback, pathUtil, _,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice;

  _ = require('lodash');

  extractOptsAndCallback = require('extract-opts').extractOptsAndCallback;

  TaskGroup = require('taskgroup').TaskGroup;

  pathUtil = require('path');

  module.exports = docpadUtil = {
    isStandardEncoding: function(encoding) {
      var _ref;
      return (_ref = encoding.toLowerCase()) === 'ascii' || _ref === 'utf8' || _ref === 'utf-8';
    },
    getLocalDocPadExecutable: function() {
      return pathUtil.join(process.cwd(), 'node_modules', 'docpad', 'bin', 'docpad');
    },
    isLocalDocPadExecutable: function() {
      var _ref;
      return _ref = docpadUtil.getLocalDocPadExecutable(), __indexOf.call(process.argv, _ref) >= 0;
    },
    getLocalDocPadExecutableExistance: function() {
      return require('safefs').existsSync(docpadUtil.getLocalDocPadExecutable()) === true;
    },
    startLocalDocPadExecutable: function(next) {
      var args, command;
      args = process.argv.slice(2);
      command = ['node', docpadUtil.getLocalDocPadExecutable()].concat(args);
      return require('safeps').spawn(command, {
        stdio: 'inherit'
      }, function(err) {
        var message;
        if (err) {
          if (next) {
            return next(err);
          } else {
            message = 'An error occured within the child DocPad instance: ' + err.message + '\n';
            return process.stderr.write(message);
          }
        } else {
          return typeof next === "function" ? next() : void 0;
        }
      });
    },
    getBasename: function(filename) {
      var basename;
      if (filename[0] === '.') {
        basename = filename.replace(/^(\.[^\.]+)\..*$/, '$1');
      } else {
        basename = filename.replace(/\..*$/, '');
      }
      return basename;
    },
    getExtensions: function(filename) {
      var extensions;
      extensions = filename.split(/\./g).slice(1);
      return extensions;
    },
    getExtension: function(extensions) {
      var extension;
      if (!require('typechecker').isArray(extensions)) {
        extensions = docpadUtil.getExtensions(extensions);
      }
      if (extensions.length !== 0) {
        extension = extensions.slice(-1)[0] || null;
      } else {
        extension = null;
      }
      return extension;
    },
    getDirPath: function(path) {
      return pathUtil.dirname(path) || '';
    },
    getFilename: function(path) {
      return pathUtil.basename(path);
    },
    getOutFilename: function(basename, extension) {
      if (basename === '.' + extension) {
        return basename;
      } else {
        return basename + (extension ? '.' + extension : '');
      }
    },
    getUrl: function(relativePath) {
      return '/' + relativePath.replace(/[\\]/g, '/');
    },
    getSlug: function(relativeBase) {
      return require('bal-util').generateSlugSync(relativeBase);
    },
    action: function(action, opts, next) {
      var actionMethod, actions, err, me, runner, tasks, _ref,
        _this = this;
      _ref = extractOptsAndCallback(opts, next), opts = _ref[0], next = _ref[1];
      me = this;
      runner = me.getActionRunner();
      if (Array.isArray(action)) {
        actions = action;
      } else {
        actions = action.split(/[,\s]+/g);
      }
      actions = _.uniq(_.compact(actions));
      next || (next = function(err) {
        if (err) {
          return _this.emit('error', err);
        }
      });
      if (actions.length === 0) {
        err = new Error('No action was given');
        next(err);
        return me;
      } else if (actions.length > 1) {
        tasks = new TaskGroup({
          next: next
        });
        actions.forEach(function(action) {
          return tasks.addTask(function(complete) {
            return me.action(action, opts, complete);
          });
        });
        tasks.run();
        return me;
      }
      action = actions[0];
      actionMethod = me[action].bind(me);
      if (!actionMethod) {
        err = new Error(util.format(locale.actionNonexistant, action));
        return next(err);
      }
      runner.addTask(function(complete) {
        return actionMethod(opts, function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          err = args[0];
          next.apply(null, args);
          return complete();
        });
      });
      return me;
    }
  };

}).call(this);
