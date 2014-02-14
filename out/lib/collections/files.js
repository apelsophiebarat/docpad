// Generated by CoffeeScript 1.6.3
(function() {
  var FileModel, FilesCollection, Model, QueryCollection, pathUtil, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  pathUtil = require('path');

  _ref = require('../base'), QueryCollection = _ref.QueryCollection, Model = _ref.Model;

  FileModel = require('../models/file');

  FilesCollection = (function(_super) {
    __extends(FilesCollection, _super);

    function FilesCollection() {
      _ref1 = FilesCollection.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    FilesCollection.prototype.model = FileModel;

    FilesCollection.prototype.collection = FilesCollection;

    FilesCollection.prototype.initialize = function(attrs, opts) {
      var _base;
      if (opts == null) {
        opts = {};
      }
      if (this.options == null) {
        this.options = {};
      }
      if ((_base = this.options).name == null) {
        _base.name = opts.name || null;
      }
      return FilesCollection.__super__.initialize.apply(this, arguments);
    };

    FilesCollection.prototype.fuzzyFindOne = function(data, sorting, paging) {
      var escapedData, file, queries, query, _i, _len;
      escapedData = data != null ? data.replace(/[\/]/g, pathUtil.sep) : void 0;
      queries = [
        {
          relativePath: escapedData
        }, {
          relativeBase: escapedData
        }, {
          url: data
        }, {
          relativePath: {
            $startsWith: escapedData
          }
        }, {
          fullPath: {
            $startsWith: escapedData
          }
        }, {
          url: {
            $startsWith: data
          }
        }
      ];
      for (_i = 0, _len = queries.length; _i < _len; _i++) {
        query = queries[_i];
        file = this.findOne(query, sorting, paging);
        if (file) {
          return file;
        }
      }
      return null;
    };

    return FilesCollection;

  })(QueryCollection);

  module.exports = FilesCollection;

}).call(this);
