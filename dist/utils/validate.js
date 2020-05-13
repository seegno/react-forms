"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getErrorPath = getErrorPath;
exports.parseValidationErrors = parseValidationErrors;
exports["default"] = validate;

var _lodash = require("lodash");

var _ajv = _interopRequireDefault(require("ajv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Export `getErrorPath`.
 */
function getErrorPath(error) {
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
    return _objectSpread({}, errors, _defineProperty({}, getErrorPath(error), getError(error)));
  }, {});
}
/**
 * `Validate` type.
 */


/**
 * Export `validate`.
 */
function validate(schema, values, options) {
  var _options;

  var _ref = (_options = options) !== null && _options !== void 0 ? _options : {},
      keywords = _ref.keywords,
      restOptions = _objectWithoutProperties(_ref, ["keywords"]);

  var ajv = new _ajv["default"]((0, _lodash.merge)({}, restOptions, {
    $data: true,
    allErrors: true
  })); // TODO: Remove this when ajv adds support for passing keywords in the contructor.
  // https://github.com/epoberezkin/ajv/issues/1136

  if (keywords) {
    for (var _i = 0, _Object$entries = Object.entries(keywords); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          keyword = _Object$entries$_i[0],
          config = _Object$entries$_i[1];

      ajv.addKeyword(keyword, config);
    }
  }

  if (ajv.validate(schema, values)) {
    return {};
  }

  return parseValidationErrors(ajv.errors);
}