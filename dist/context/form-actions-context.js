"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useFormActions = useFormActions;
exports.FormActionsContext = void 0;

var _react = require("react");

/**
 * Module dependencies.
 */

/**
 * Export `FormActionsContext`.
 */
var FormActionsContext = (0, _react.createContext)({
  reset: function reset() {},
  submit: function submit() {}
});
/**
 * Export `useFormActions`.
 */

exports.FormActionsContext = FormActionsContext;

function useFormActions() {
  return (0, _react.useContext)(FormActionsContext);
}