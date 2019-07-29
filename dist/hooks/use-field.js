"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = useField;

var _react = require("react");

var _fieldActionsContext = require("../context/field-actions-context");

var _formStateContext = require("../context/form-state-context");

/**
 * Module dependencies.
 */

/**
 * Export `useField`.
 */
function useField(field) {
  var _ref, _ref2;

  var _useFormState = (0, _formStateContext.useFormState)(),
      errors = _useFormState.errors,
      meta = _useFormState.meta,
      values = _useFormState.values;

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
    error: (_ref = errors === null || errors === void 0 ? void 0 : errors[field]) !== null && _ref !== void 0 ? _ref : null,
    meta: (_ref2 = meta === null || meta === void 0 ? void 0 : meta[field]) !== null && _ref2 !== void 0 ? _ref2 : {},
    onBlur: onBlur,
    onChange: onChange,
    onFocus: onFocus,
    value: values === null || values === void 0 ? void 0 : values[field]
  };
}