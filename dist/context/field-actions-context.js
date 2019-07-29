"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useFieldActions = useFieldActions;
exports.FieldActionsContext = void 0;

var _react = require("react");

/**
 * Module dependencies.
 */

/**
 * Export `FieldActionsContext`.
 */
var FieldActionsContext = (0, _react.createContext)({
  blurField: function blurField() {},
  focusField: function focusField() {},
  registerField: function registerField() {},
  setFieldValue: function setFieldValue() {}
});
/**
 * Export `useFieldActions`.
 */

exports.FieldActionsContext = FieldActionsContext;

function useFieldActions() {
  return (0, _react.useContext)(FieldActionsContext);
}