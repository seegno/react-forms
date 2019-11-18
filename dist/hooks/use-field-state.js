"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = useFieldState;

var _react = require("react");

var _formStateContext = require("../context/form-state-context");

/**
 * Module dependencies.
 */

/**
 * Export `useFieldState`.
 */
function useFieldState(field) {
  var _fields, _ref2, _ref3;

  var _useFormState = (0, _formStateContext.useFormState)(),
      fields = _useFormState.fields;

  var _ref = (_fields = fields) !== null && _fields !== void 0 ? _fields : {},
      errors = _ref.errors,
      meta = _ref.meta,
      values = _ref.values;

  var fieldState = {
    error: (_ref2 = errors === null || errors === void 0 ? void 0 : errors[field]) !== null && _ref2 !== void 0 ? _ref2 : null,
    meta: (_ref3 = meta === null || meta === void 0 ? void 0 : meta[field]) !== null && _ref3 !== void 0 ? _ref3 : {},
    value: values === null || values === void 0 ? void 0 : values[field]
  };
  (0, _react.useDebugValue)(fieldState);
  return fieldState;
}