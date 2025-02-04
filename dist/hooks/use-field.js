"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = useField;
var _react = require("react");
var _fieldActionsContext = require("../context/field-actions-context");
var _useFieldState2 = _interopRequireDefault(require("./use-field-state"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
/**
 * Module dependencies.
 */
/**
 * Export `useField`.
 */
function useField(field) {
  var _useFieldState = (0, _useFieldState2["default"])(field),
    error = _useFieldState.error,
    meta = _useFieldState.meta,
    value = _useFieldState.value;
  var _useFieldActions = (0, _fieldActionsContext.useFieldActions)(),
    blurField = _useFieldActions.blurField,
    focusField = _useFieldActions.focusField,
    registerField = _useFieldActions.registerField,
    setFieldValue = _useFieldActions.setFieldValue;
  (0, _react.useEffect)(function () {
    registerField(field);
  }, [field, registerField]);
  var onChange = (0, _react.useCallback)(function (value) {
    setFieldValue(field, value);
  }, [field, setFieldValue]);
  var onBlur = (0, _react.useCallback)(function () {
    blurField(field);
  }, [field, blurField]);
  var onFocus = (0, _react.useCallback)(function () {
    focusField(field);
  }, [field, focusField]);
  return {
    error: error,
    meta: meta,
    onBlur: onBlur,
    onChange: onChange,
    onFocus: onFocus,
    value: value
  };
}