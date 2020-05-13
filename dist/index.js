"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "FormProvider", {
  enumerable: true,
  get: function get() {
    return _formProvider["default"];
  }
});
Object.defineProperty(exports, "getErrorPath", {
  enumerable: true,
  get: function get() {
    return _validate.getErrorPath;
  }
});
Object.defineProperty(exports, "parseValidationErrors", {
  enumerable: true,
  get: function get() {
    return _validate.parseValidationErrors;
  }
});
Object.defineProperty(exports, "useField", {
  enumerable: true,
  get: function get() {
    return _useField["default"];
  }
});
Object.defineProperty(exports, "useFieldActions", {
  enumerable: true,
  get: function get() {
    return _fieldActionsContext.useFieldActions;
  }
});
Object.defineProperty(exports, "useFieldState", {
  enumerable: true,
  get: function get() {
    return _useFieldState["default"];
  }
});
Object.defineProperty(exports, "useForm", {
  enumerable: true,
  get: function get() {
    return _useForm["default"];
  }
});
Object.defineProperty(exports, "formActionTypes", {
  enumerable: true,
  get: function get() {
    return _useForm.actionTypes;
  }
});
Object.defineProperty(exports, "useFormActions", {
  enumerable: true,
  get: function get() {
    return _formActionsContext.useFormActions;
  }
});
Object.defineProperty(exports, "useFormState", {
  enumerable: true,
  get: function get() {
    return _formStateContext.useFormState;
  }
});

var _formProvider = _interopRequireDefault(require("./components/form-provider"));

var _validate = require("./utils/validate");

var _useField = _interopRequireDefault(require("./hooks/use-field"));

var _fieldActionsContext = require("./context/field-actions-context");

var _useFieldState = _interopRequireDefault(require("./hooks/use-field-state"));

var _useForm = _interopRequireWildcard(require("./hooks/use-form"));

var _formActionsContext = require("./context/form-actions-context");

var _formStateContext = require("./context/form-state-context");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }