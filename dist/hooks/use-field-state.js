"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = useFieldState;

var _formStateContext = require("../context/form-state-context");

/**
 * Module dependencies.
 */

/**
 * Export `useFieldState`.
 */
function useFieldState(field) {
  var _ref, _ref2;

  var _useFormState = (0, _formStateContext.useFormState)(),
      errors = _useFormState.errors,
      meta = _useFormState.meta,
      values = _useFormState.values;

  return {
    error: (_ref = errors === null || errors === void 0 ? void 0 : errors[field]) !== null && _ref !== void 0 ? _ref : null,
    meta: (_ref2 = meta === null || meta === void 0 ? void 0 : meta[field]) !== null && _ref2 !== void 0 ? _ref2 : {},
    value: values === null || values === void 0 ? void 0 : values[field]
  };
}