"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FieldActionsContext = void 0;
exports.useFieldActions = useFieldActions;
var _react = require("react");
/**
 * Module dependencies.
 */
/**
 * `FieldActionsContextType` type.
 */
/**
 * Export `FieldActionsContext`.
 */
var FieldActionsContext = exports.FieldActionsContext = /*#__PURE__*/(0, _react.createContext)({
  blurField: function blurField() {},
  focusField: function focusField() {},
  registerField: function registerField() {},
  setFieldValue: function setFieldValue() {}
});

/**
 * Export `useFieldActions`.
 */

function useFieldActions() {
  return (0, _react.useContext)(FieldActionsContext);
}