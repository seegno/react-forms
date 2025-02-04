"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormStateContext = void 0;
exports.useFormState = useFormState;
var _react = require("react");
/**
 * Module dependencies.
 */
/**
 * Export `FormStateContext`.
 */
var FormStateContext = exports.FormStateContext = /*#__PURE__*/(0, _react.createContext)({});

/**
 * Export `useFormState`.
 */

function useFormState() {
  return (0, _react.useContext)(FormStateContext);
}