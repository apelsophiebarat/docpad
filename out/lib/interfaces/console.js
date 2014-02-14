// Generated by CoffeeScript 1.6.3
(function() {
  var ConsoleInterface, TaskGroup, extendr, pathUtil, promptly, safefs, safeps,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty;

  pathUtil = require('path');

  safefs = require('safefs');

  safeps = require('safeps');

  TaskGroup = require('taskgroup').TaskGroup;

  extendr = require('extendr');

  promptly = require('promptly');

  ConsoleInterface = (function() {
    function ConsoleInterface(opts, next) {
      this.watch = __bind(this.watch, this);
      this.skeleton = __bind(this.skeleton, this);
      this.clean = __bind(this.clean, this);
      this.server = __bind(this.server, this);
      this.run = __bind(this.run, this);
      this.render = __bind(this.render, this);
      this.uninstall = __bind(this.uninstall, this);
      this.install = __bind(this.install, this);
      this.upgrade = __bind(this.upgrade, this);
      this.update = __bind(this.update, this);
      this.info = __bind(this.info, this);
      this.help = __bind(this.help, this);
      this.generate = __bind(this.generate, this);
      this.init = __bind(this.init, this);
      this.action = __bind(this.action, this);
      this.welcomeCallback = __bind(this.welcomeCallback, this);
      this.selectSkeletonCallback = __bind(this.selectSkeletonCallback, this);
      this.extractConfig = __bind(this.extractConfig, this);
      this.performAction = __bind(this.performAction, this);
      this.wrapAction = __bind(this.wrapAction, this);
      this.destroy = __bind(this.destroy, this);
      this.destroyWithError = __bind(this.destroyWithError, this);
      this.getCommander = __bind(this.getCommander, this);
      this.start = __bind(this.start, this);
      var commander, consoleInterface, docpad, locale;
      consoleInterface = this;
      this.docpad = docpad = opts.docpad;
      this.commander = commander = require('commander');
      locale = docpad.getLocale();
      commander.version(docpad.getVersionString()).option('-o, --out <outPath>', locale.consoleOptionOut).option('-c, --config <configPath>', locale.consoleOptionConfig).option('-e, --env <environment>', locale.consoleOptionEnv).option('-d, --debug [logLevel]', locale.consoleOptionDebug, parseInt).option('-g, --global', locale.consoleOptionGlobal).option('-f, --force', locale.consoleOptionForce).option('-p, --port <port>', locale.consoleOptionPort, parseInt).option('--cache', locale.consoleOptionCache).option('--silent', locale.consoleOptionSilent).option('--skeleton <skeleton>', locale.consoleOptionSkeleton).option('--profile', locale.consoleOptionProfile).option('--offline', locale.consoleOptionOffline);
      commander.command('action <actions>').description(locale.consoleDescriptionRun).action(consoleInterface.wrapAction(consoleInterface.action));
      commander.command('init').description(locale.consoleDescriptionInit).action(consoleInterface.wrapAction(consoleInterface.init));
      commander.command('run').description(locale.consoleDescriptionRun).action(consoleInterface.wrapAction(consoleInterface.run, {
        _stayAlive: true
      }));
      commander.command('server').description(locale.consoleDescriptionServer).action(consoleInterface.wrapAction(consoleInterface.server, {
        _stayAlive: true
      }));
      commander.command('skeleton').description(locale.consoleDescriptionSkeleton).option('-s, --skeleton <skeleton>', locale.consoleOptionSkeleton).action(consoleInterface.wrapAction(consoleInterface.skeleton));
      commander.command('render [path]').description(locale.consoleDescriptionRender).action(consoleInterface.wrapAction(consoleInterface.render, {
        logLevel: 3,
        checkVersion: false,
        welcome: false,
        prompts: false
      }));
      commander.command('generate').description(locale.consoleDescriptionGenerate).action(consoleInterface.wrapAction(consoleInterface.generate));
      commander.command('watch').description(locale.consoleDescriptionWatch).action(consoleInterface.wrapAction(consoleInterface.watch, {
        _stayAlive: true
      }));
      commander.command('update').description(locale.consoleDescriptionUpdate).action(consoleInterface.wrapAction(consoleInterface.update));
      commander.command('upgrade').description(locale.consoleDescriptionUpgrade).action(consoleInterface.wrapAction(consoleInterface.upgrade));
      commander.command('install [pluginName]').description(locale.consoleDescriptionInstall).action(consoleInterface.wrapAction(consoleInterface.install));
      commander.command('uninstall <pluginName>').description(locale.consoleDescriptionUninstall).action(consoleInterface.wrapAction(consoleInterface.uninstall));
      commander.command('clean').description(locale.consoleDescriptionClean).action(consoleInterface.wrapAction(consoleInterface.clean));
      commander.command('info').description(locale.consoleDescriptionInfo).action(consoleInterface.wrapAction(consoleInterface.info));
      commander.command('help').description(locale.consoleDescriptionHelp).action(consoleInterface.wrapAction(consoleInterface.help));
      commander.command('*').description(locale.consoleDescriptionUnknown).action(consoleInterface.wrapAction(consoleInterface.help));
      docpad.on('welcome', function(data, next) {
        return consoleInterface.welcomeCallback(data, next);
      });
      docpad.emitSerial('consoleSetup', {
        consoleInterface: consoleInterface,
        commander: commander
      }, function(err) {
        if (err) {
          return consoleInterface.destroyWithError(err);
        }
        return next(null, consoleInterface);
      });
      this;
    }

    ConsoleInterface.prototype.start = function(argv) {
      this.commander.parse(argv || process.argv);
      return this;
    };

    ConsoleInterface.prototype.getCommander = function() {
      return this.commander;
    };

    ConsoleInterface.prototype.destroyWithError = function(err) {
      var docpad, locale;
      docpad = this.docpad;
      locale = docpad.getLocale();
      docpad.log('error', locale.consoleError);
      docpad.error(err, 'err', this.destroy);
      return this;
    };

    ConsoleInterface.prototype.destroy = function(err) {
      var docpad, locale;
      docpad = this.docpad;
      locale = docpad.getLocale();
      if (err) {
        process.stderr.write(require('util').inspect(err.stack || err.message || err));
      }
      docpad.log('info', locale.consoleShutdown);
      docpad.destroy(function(err) {
        if (err) {
          return process.stderr.write(require('util').inspect(err.stack || err.message || err));
        }
      });
      return this;
    };

    ConsoleInterface.prototype.wrapAction = function(action, config) {
      var consoleInterface;
      consoleInterface = this;
      return function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return consoleInterface.performAction(action, args, config);
      };
    };

    ConsoleInterface.prototype.performAction = function(action, args, config) {
      var completeAction, consoleInterface, docpad, opts, stayAlive,
        _this = this;
      if (config == null) {
        config = {};
      }
      consoleInterface = this;
      docpad = this.docpad;
      stayAlive = false;
      if (config._stayAlive) {
        stayAlive = config._stayAlive;
        delete config._stayAlive;
      }
      opts = {};
      opts.commander = args.slice(-1)[0];
      opts.args = args.slice(0, -1);
      opts.instanceConfig = extendr.safeDeepExtendPlainObjects({}, this.extractConfig(opts.commander), config);
      completeAction = function(err) {
        var locale;
        locale = docpad.getLocale();
        if (err) {
          return consoleInterface.destroyWithError(err);
        }
        docpad.log('info', locale.consoleSuccess);
        if (stayAlive === false) {
          return consoleInterface.destroy();
        }
      };
      docpad.action('load ready', opts.instanceConfig, function(err) {
        if (err) {
          return completeAction(err);
        }
        return action(completeAction, opts);
      });
      return this;
    };

    ConsoleInterface.prototype.extractConfig = function(customConfig) {
      var commanderConfig, config, configPath, key, outPath, sourceConfig, value;
      if (customConfig == null) {
        customConfig = {};
      }
      config = {};
      commanderConfig = this.commander;
      sourceConfig = this.docpad.initialConfig;
      if (commanderConfig.debug) {
        if (commanderConfig.debug === true) {
          commanderConfig.debug = 7;
        }
        commanderConfig.logLevel = commanderConfig.debug;
      }
      if (commanderConfig.silent != null) {
        commanderConfig.prompts = !commanderConfig.silent;
      }
      if (commanderConfig.silent != null) {
        commanderConfig.databaseCache = commanderConfig.cache;
      }
      if (commanderConfig.config) {
        configPath = pathUtil.resolve(process.cwd(), commanderConfig.config);
        commanderConfig.configPaths = [configPath];
      }
      if (commanderConfig.out) {
        outPath = pathUtil.resolve(process.cwd(), commanderConfig.out);
        commanderConfig.outPath = outPath;
      }
      for (key in commanderConfig) {
        if (!__hasProp.call(commanderConfig, key)) continue;
        value = commanderConfig[key];
        if (typeof sourceConfig[key] !== 'undefined') {
          config[key] = value;
        }
      }
      for (key in customConfig) {
        if (!__hasProp.call(customConfig, key)) continue;
        value = customConfig[key];
        if (typeof sourceConfig[key] !== 'undefined') {
          config[key] = value;
        }
      }
      return config;
    };

    ConsoleInterface.prototype.selectSkeletonCallback = function(skeletonsCollection, next) {
      var commander, consoleInterface, docpad, locale, skeletonNames;
      consoleInterface = this;
      commander = this.commander;
      docpad = this.docpad;
      locale = docpad.getLocale();
      skeletonNames = [];
      docpad.log('info', locale.skeletonSelectionIntroduction + '\n');
      skeletonsCollection.forEach(function(skeletonModel) {
        var skeletonDescription, skeletonName;
        skeletonName = skeletonModel.get('name');
        skeletonDescription = skeletonModel.get('description').replace(/\n/g, '\n\t');
        skeletonNames.push(skeletonName);
        return console.log("  " + (skeletonModel.get('position') + 1) + ".\t" + skeletonName + "\n  \t" + skeletonDescription + "\n");
      });
      consoleInterface.choose(locale.skeletonSelectionPrompt, skeletonNames, null, function(err, choice) {
        var index;
        if (err) {
          return next(err);
        }
        index = skeletonNames.indexOf(choice);
        return next(null, skeletonsCollection.at(index));
      });
      return this;
    };

    ConsoleInterface.prototype.welcomeCallback = function(opts, next) {
      var commander, consoleInterface, docpad, locale, userConfig, welcomeTasks;
      consoleInterface = this;
      commander = this.commander;
      docpad = this.docpad;
      locale = docpad.getLocale();
      userConfig = docpad.userConfig;
      welcomeTasks = new TaskGroup().once('complete', next);
      welcomeTasks.addTask(function(complete) {
        if (docpad.config.prompts === false || userConfig.tos === true) {
          return complete();
        }
        return consoleInterface.confirm(locale.tosPrompt, {
          "default": true
        }, function(err, ok) {
          if (err) {
            return complete(err);
          }
          return docpad.track('tos', {
            ok: ok
          }, function(err) {
            if (ok) {
              userConfig.tos = true;
              console.log(locale.tosAgree);
              docpad.updateUserConfig(complete);
            } else {
              console.log(locale.tosDisagree);
              process.exit();
            }
          });
        });
      });
      welcomeTasks.addTask(function(complete) {
        if (docpad.config.prompts === false || (userConfig.subscribed != null) || ((userConfig.subscribeTryAgain != null) && (new Date()) > (new Date(userConfig.subscribeTryAgain)))) {
          return complete();
        }
        return consoleInterface.confirm(locale.subscribePrompt, {
          "default": true
        }, function(err, ok) {
          if (err) {
            return complete(err);
          }
          return docpad.track('subscribe', {
            ok: ok
          }, function(err) {
            var commands;
            if (!ok) {
              console.log(locale.subscribeIgnore);
              userConfig.subscribed = false;
              docpad.updateUserConfig(function(err) {
                if (err) {
                  return complete(err);
                }
                return setTimeout(complete, 2000);
              });
              return;
            }
            commands = [['config', '--get', 'user.name'], ['config', '--get', 'user.email'], ['config', '--get', 'github.user']];
            return safeps.spawnCommands('git', commands, function(err, results) {
              var subscribeTasks, _ref, _ref1, _ref2;
              userConfig.name = String((results != null ? (_ref = results[0]) != null ? _ref[1] : void 0 : void 0) || '').trim() || null;
              userConfig.email = String((results != null ? (_ref1 = results[1]) != null ? _ref1[1] : void 0 : void 0) || '').trim() || null;
              userConfig.username = String((results != null ? (_ref2 = results[2]) != null ? _ref2[1] : void 0 : void 0) || '').trim() || null;
              if (userConfig.name || userConfig.email || userConfig.username) {
                console.log(locale.subscribeConfigNotify);
              }
              subscribeTasks = new TaskGroup().once('complete', function(err) {
                if (err) {
                  console.log(locale.subscribeError);
                  userConfig.subscribeTryAgain = new Date().getTime() + 1000 * 60 * 60 * 24;
                } else {
                  console.log(locale.subscribeSuccess);
                  userConfig.subscribed = true;
                  userConfig.subscribeTryAgain = null;
                }
                return docpad.updateUserConfig(userConfig, complete);
              });
              subscribeTasks.addTask(function(complete) {
                return consoleInterface.prompt(locale.subscribeNamePrompt, {
                  "default": userConfig.name
                }, function(err, result) {
                  if (err) {
                    return complete(err);
                  }
                  userConfig.name = result;
                  return complete();
                });
              });
              subscribeTasks.addTask(function(complete) {
                return consoleInterface.prompt(locale.subscribeEmailPrompt, {
                  "default": userConfig.email
                }, function(err, result) {
                  if (err) {
                    return complete(err);
                  }
                  userConfig.email = result;
                  return complete();
                });
              });
              subscribeTasks.addTask(function(complete) {
                return consoleInterface.prompt(locale.subscribeUsernamePrompt, {
                  "default": userConfig.username
                }, function(err, result) {
                  if (err) {
                    return complete(err);
                  }
                  userConfig.username = result;
                  return complete();
                });
              });
              subscribeTasks.addTask(function(complete) {
                return docpad.updateUserConfig(complete);
              });
              subscribeTasks.addTask(function(complete) {
                console.log(locale.subscribeProgress);
                return docpad.subscribe(function(err, res) {
                  if (err) {
                    docpad.log('debug', locale.subscribeRequestError, err.message);
                    return complete(err);
                  }
                  docpad.log('debug', locale.subscribeRequestData, res.text);
                  return complete();
                });
              });
              return subscribeTasks.run();
            });
          });
        });
      });
      welcomeTasks.run();
      return this;
    };

    ConsoleInterface.prototype.prompt = function(message, opts, next) {
      if (opts == null) {
        opts = {};
      }
      if (opts["default"]) {
        message += " [" + opts["default"] + "]";
      }
      opts = extendr.extend({
        trim: true,
        retry: true,
        silent: false
      }, opts);
      promptly.prompt(message, opts, next);
      return this;
    };

    ConsoleInterface.prototype.confirm = function(message, opts, next) {
      if (opts == null) {
        opts = {};
      }
      if (opts["default"] === true) {
        message += " [Y/n]";
      } else if (opts["default"] === false) {
        message += " [y/N]";
      }
      opts = extendr.extend({
        trim: true,
        retry: true,
        silent: false
      }, opts);
      promptly.confirm(message, opts, next);
      return this;
    };

    ConsoleInterface.prototype.choose = function(message, choices, opts, next) {
      var choice, i, index, indexes, prompt, _i, _len;
      if (opts == null) {
        opts = {};
      }
      message += " [1-" + choices.length + "]";
      indexes = [];
      for (i = _i = 0, _len = choices.length; _i < _len; i = ++_i) {
        choice = choices[i];
        index = i + 1;
        indexes.push(index);
        message += "\n  " + index + ".\t" + choice;
      }
      opts = extendr.extend({
        trim: true,
        retry: true,
        silent: false
      }, opts);
      prompt = '> ';
      if (opts["default"]) {
        prompt += " [" + opts["default"] + "]";
      }
      console.log(message);
      promptly.choose(prompt, indexes, opts, function(err, index) {
        if (err) {
          return next(err);
        }
        choice = choices[index - 1];
        return next(null, choice);
      });
      return this;
    };

    ConsoleInterface.prototype.action = function(next, opts) {
      var actions;
      actions = opts.args[0];
      this.docpad.log('info', 'Performing the actions:', actions);
      this.docpad.action(actions, next);
      return this;
    };

    ConsoleInterface.prototype.init = function(next) {
      this.docpad.action('init', next);
      return this;
    };

    ConsoleInterface.prototype.generate = function(next) {
      this.docpad.action('generate', next);
      return this;
    };

    ConsoleInterface.prototype.help = function(next) {
      var help;
      help = this.commander.helpInformation();
      console.log(help);
      next();
      return this;
    };

    ConsoleInterface.prototype.info = function(next) {
      var info;
      info = require('util').inspect(this.docpad.config);
      console.log(info);
      next();
      return this;
    };

    ConsoleInterface.prototype.update = function(next, opts) {
      this.docpad.action('clean update', next);
      return this;
    };

    ConsoleInterface.prototype.upgrade = function(next, opts) {
      this.docpad.action('upgrade', next);
      return this;
    };

    ConsoleInterface.prototype.install = function(next, opts) {
      var plugin;
      plugin = opts.args[0] || null;
      this.docpad.action('install', {
        plugin: plugin
      }, next);
      return this;
    };

    ConsoleInterface.prototype.uninstall = function(next, opts) {
      var plugin;
      plugin = opts.args[0] || null;
      this.docpad.action('uninstall', {
        plugin: plugin
      }, next);
      return this;
    };

    ConsoleInterface.prototype.render = function(next, opts) {
      var basename, commander, data, docpad, filename, renderDocument, renderOpts, stdin, timeout, timeoutFunction, useStdin;
      docpad = this.docpad;
      commander = this.commander;
      renderOpts = {};
      filename = opts.args[0] || null;
      basename = pathUtil.basename(filename);
      renderOpts.filename = filename;
      renderOpts.renderSingleExtensions = 'auto';
      data = '';
      useStdin = true;
      renderDocument = function() {
        return docpad.action('render', renderOpts, function(err, result) {
          if (err) {
            return docpad.fatal(err);
          }
          if (commander.out != null) {
            return safefs.writeFile(commander.out, result, next);
          } else {
            process.stdout.write(result);
            return next();
          }
        });
      };
      timeoutFunction = function() {
        var timeout;
        timeout = null;
        if (data.replace(/\s+/, '')) {
          return;
        }
        useStdin = false;
        stdin.pause();
        return renderDocument();
      };
      timeout = setTimeout(timeoutFunction, 1000);
      stdin = process.stdin;
      stdin.resume();
      stdin.setEncoding('utf-8');
      stdin.on('data', function(_data) {
        return data += _data.toString();
      });
      process.stdin.on('end', function() {
        if (!useStdin) {
          return;
        }
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        renderOpts.data = data;
        return renderDocument();
      });
      return this;
    };

    ConsoleInterface.prototype.run = function(next) {
      this.docpad.action('run', {
        selectSkeletonCallback: this.selectSkeletonCallback,
        next: next
      });
      return this;
    };

    ConsoleInterface.prototype.server = function(next) {
      this.docpad.action('server generate', next);
      return this;
    };

    ConsoleInterface.prototype.clean = function(next) {
      this.docpad.action('clean', next);
      return this;
    };

    ConsoleInterface.prototype.skeleton = function(next) {
      this.docpad.action('skeleton', {
        selectSkeletonCallback: this.selectSkeletonCallback,
        next: next
      });
      return this;
    };

    ConsoleInterface.prototype.watch = function(next) {
      this.docpad.action('generate watch', next);
      return this;
    };

    return ConsoleInterface;

  })();

  module.exports = ConsoleInterface;

}).call(this);
