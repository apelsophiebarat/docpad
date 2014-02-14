// Generated by CoffeeScript 1.6.3
(function() {
  var Collection, ElementsCollection, Model, typeChecker, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  typeChecker = require('typechecker');

  _ref = require('../base'), Collection = _ref.Collection, Model = _ref.Model;

  ElementsCollection = (function(_super) {
    __extends(ElementsCollection, _super);

    function ElementsCollection() {
      _ref1 = ElementsCollection.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    ElementsCollection.prototype.model = Model;

    ElementsCollection.prototype.add = function(values, opts) {
      var key, value, _i, _len;
      if (typeChecker.isArray(values)) {
        values = values.slice();
      } else if (values) {
        values = [values];
      } else {
        values = [];
      }
      for (key = _i = 0, _len = values.length; _i < _len; key = ++_i) {
        value = values[key];
        if (typeChecker.isString(value)) {
          values[key] = new Model({
            html: value
          });
        }
      }
      ElementsCollection.__super__.add.call(this, values, opts);
      return this;
    };

    ElementsCollection.prototype.set = function() {
      ElementsCollection.__super__.set.apply(this, arguments);
      return this;
    };

    ElementsCollection.prototype.remove = function() {
      ElementsCollection.__super__.remove.apply(this, arguments);
      return this;
    };

    ElementsCollection.prototype.reset = function() {
      ElementsCollection.__super__.reset.apply(this, arguments);
      return this;
    };

    ElementsCollection.prototype.toHTML = function() {
      var html;
      html = '';
      this.forEach(function(item) {
        return html += item.get('html') || '';
      });
      return html;
    };

    ElementsCollection.prototype.join = function() {
      return this.toHTML();
    };

    return ElementsCollection;

  })(Collection);

  module.exports = ElementsCollection;

}).call(this);
