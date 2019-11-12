"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = validate;

var _ajv = _interopRequireDefault(require("ajv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Get property name.
 */
function getPropertyName(error) {
  var key = error.dataPath.substring(1);

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
    case 'maxLength':
      return {
        max: error.params.limit
      };

    case 'minLength':
      return {
        min: error.params.limit
      };

    default:
      return;
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
    return _objectSpread({}, errors, _defineProperty({}, getPropertyName(error), getError(error)));
  }, {});
}
/**
 * Export `validate`.
 */


function validate(schema, values) {
  var ajv = new _ajv["default"]({
    $data: true,
    allErrors: true
  });

  if (ajv.validate(schema, values)) {
    return {};
  }

  return parseValidationErrors(ajv.errors);
}