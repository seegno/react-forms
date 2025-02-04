"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormActionsContext = void 0;
exports.useFormActions = useFormActions;
var _react = require("react");
/**
 * Module dependencies.
 */
/**
 * `FormActionsContextType` type.
 */
/**
 * Export `FormActionsContext`.
 */
var FormActionsContext = exports.FormActionsContext = /*#__PURE__*/(0, _react.createContext)({
  reset: function reset() {},
  submit: function submit() {}
});

/**
 * Export `useFormActions`.
 */

function useFormActions() {
  return (0, _react.useContext)(FormActionsContext);
}