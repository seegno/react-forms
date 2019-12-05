"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fieldActionsContext = require("../context/field-actions-context");

var _formActionsContext = require("../context/form-actions-context");

var _formStateContext = require("../context/form-state-context");

var _react = _interopRequireDefault(require("react"));

var _useForm2 = _interopRequireDefault(require("../hooks/use-form"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Module dependencies.
 */

/**
 * `FormProvider` component.
 */
var FormProvider = function FormProvider(props) {
  var children = props.children,
      initialValues = props.initialValues,
      jsonSchema = props.jsonSchema,
      onFormValuesChanged = props.onFormValuesChanged,
      onSubmit = props.onSubmit,
      stateReducer = props.stateReducer;

  var _useForm = (0, _useForm2["default"])({
    initialValues: initialValues,
    jsonSchema: jsonSchema,
    onSubmit: onSubmit,
    onValuesChanged: onFormValuesChanged,
    stateReducer: stateReducer
  }),
      fieldActions = _useForm.fieldActions,
      formActions = _useForm.formActions,
      state = _useForm.state;

  return _react["default"].createElement(_fieldActionsContext.FieldActionsContext.Provider, {
    value: fieldActions
  }, _react["default"].createElement(_formActionsContext.FormActionsContext.Provider, {
    value: formActions
  }, _react["default"].createElement(_formStateContext.FormStateContext.Provider, {
    value: state
  }, typeof children === 'function' ? children(formActions) : children)));
};
/**
 * Export `FormProvider` component.
 */


var _default = FormProvider;
exports["default"] = _default;