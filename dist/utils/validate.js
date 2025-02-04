"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = validate;
exports.getErrorPath = getErrorPath;
exports.parseValidationErrors = parseValidationErrors;
var _lodash = require("lodash");
var _ajv = _interopRequireDefault(require("ajv"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * Module dependencies.
 */
/**
 * Export `ValidationOptions` type.
 */

/**
 * `ValidationError` type.
 */

/**
 * Export `FieldError` type.
 */

/**
 * Export `FieldErrors` type.
 */

/**
 * Export `getErrorPath`.
 */

function getErrorPath(error) {
  var key;

  // TODO: Handle nested properties.
  if (error.instancePath.startsWith('/')) {
    key = error.instancePath.substring(1);
  } else {
    key = error.instancePath.substring(2, error.instancePath.length - 2);
  }
  key = key.replace(/\/(\d+)(?=\/|$)/g, '[$1]').replace(/\//g, '.');
  switch (error.keyword) {
    case 'required':
      return "".concat(key ? "".concat(key, ".") : '').concat(error.params.missingProperty);
    case 'additionalProperties':
      return "".concat(key ? "".concat(key, ".") : '').concat(error.params.additionalProperty);
    default:
      return key;
  }
}

/**
 * Get error args.
 */

function getErrorArgs(error) {
  switch (error.keyword) {
    case 'maxItems':
    case 'maxLength':
    case 'maxProperties':
    case 'maximum':
      return {
        max: error.params.limit
      };
    case 'minItems':
    case 'minLength':
    case 'minProperties':
    case 'minimum':
      return {
        min: error.params.limit
      };
    default:
      return error.params;
  }
}

/**
 * Get error.
 */

var getError = function getError(error) {
  return {
    args: getErrorArgs(error),
    rule: error.keyword
  };
};

/**
 * Parse validation errors.
 */

function parseValidationErrors(validationErrors) {
  return validationErrors.reduce(function (errors, error) {
    return _objectSpread(_objectSpread({}, errors), {}, _defineProperty({}, getErrorPath(error), getError(error)));
  }, {});
}

/**
 * `Validate` type.
 */

/**
 * Export `validate`.
 */

function validate(schema, values) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var ajv = new _ajv["default"]((0, _lodash.merge)({}, options, {
    $data: true,
    allErrors: true
  }));
  if (ajv.validate(schema, values)) {
    return {};
  }
  return parseValidationErrors(ajv.errors);
}