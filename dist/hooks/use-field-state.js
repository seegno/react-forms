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
  var _errors$field, _meta$field;
  var _useFormState = (0, _formStateContext.useFormState)(),
    fields = _useFormState.fields;
  var _ref = fields !== null && fields !== void 0 ? fields : {},
    errors = _ref.errors,
    meta = _ref.meta,
    values = _ref.values;
  var fieldState = {
    error: (_errors$field = errors === null || errors === void 0 ? void 0 : errors[field]) !== null && _errors$field !== void 0 ? _errors$field : null,
    meta: (_meta$field = meta === null || meta === void 0 ? void 0 : meta[field]) !== null && _meta$field !== void 0 ? _meta$field : {},
    value: values === null || values === void 0 ? void 0 : values[field]
  };
  (0, _react.useDebugValue)(fieldState);
  return fieldState;
}