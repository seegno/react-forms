"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useFormState = useFormState;
exports.FormStateContext = void 0;

var _react = require("react");

/**
 * Module dependencies.
 */

/**
 * Export `FormStateContext`.
 */
var FormStateContext = (0, _react.createContext)({});
/**
 * Export `useFormState`.
 */

exports.FormStateContext = FormStateContext;

function useFormState() {
  return (0, _react.useContext)(FormStateContext);
}