"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.actionTypes = void 0;
exports["default"] = useForm;
var _lodash = require("lodash");
var _react = require("react");
var _validate3 = _interopRequireDefault(require("../utils/validate"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * Module dependencies.
 */
/**
 * Export `actionTypes`.
 */

var actionTypes = exports.actionTypes = {
  BLUR: 'BLUR',
  FOCUS: 'FOCUS',
  INIT: 'INIT',
  REGISTER_FIELD: 'REGISTER_FIELD',
  RESET: 'RESET',
  SET_FIELD_VALUE: 'SET_FIELD_VALUE',
  SUBMIT_FAILURE: 'SUBMIT_FAILURE',
  SUBMIT_START: 'SUBMIT_START',
  SUBMIT_SUCCESS: 'SUBMIT_SUCCESS',
  SUBMITTING: 'SUBMITTING'
};

/**
 * Export `Submit` type.
 */

/**
 * Export `Action` type.
 */

/**
 * Export `FieldMetaType` type.
 */

/**
 * Export `FormMetaType` type.
 */

/**
 * Export `FormState` type.
 */

/**
 * Is field registered.
 */

function isFieldRegistered(action, state) {
  return action.type === actionTypes.REGISTER_FIELD && state.fields.meta[action.payload.field];
}

/**
 * Values reducer.
 */

var valuesReducer = function valuesReducer(state, action) {
  var payload = action.payload,
    type = action.type;
  switch (type) {
    case actionTypes.SET_FIELD_VALUE:
      {
        var newValue;
        if (typeof payload.value === 'function') {
          newValue = payload.value(state[payload.field]);
        } else {
          newValue = payload.value;
        }
        return _objectSpread(_objectSpread({}, state), {}, _defineProperty({}, payload.field, newValue));
      }
    case actionTypes.REGISTER_FIELD:
      return _objectSpread(_objectSpread({}, state), {}, _defineProperty({}, payload.field, state[payload.field]));
    case actionTypes.RESET:
      return payload.initialValues;
    default:
      return state;
  }
};

/**
 * Meta reducer.
 */

var metaReducer = function metaReducer(state, action) {
  var payload = action.payload,
    type = action.type;
  switch (type) {
    case actionTypes.BLUR:
      return _objectSpread(_objectSpread({}, state), {}, _defineProperty({}, payload.field, _objectSpread(_objectSpread({}, state[payload.field]), {}, {
        active: false,
        touched: true
      })));
    case actionTypes.SET_FIELD_VALUE:
      if (payload.value === undefined) {
        return state;
      }
      return _objectSpread(_objectSpread({}, state), {}, _defineProperty({}, payload.field, _objectSpread(_objectSpread({}, state[payload.field]), {}, {
        dirty: true
      })));
    case actionTypes.FOCUS:
      return _objectSpread(_objectSpread({}, state), {}, _defineProperty({}, payload.field, _objectSpread(_objectSpread({}, state[payload.field]), {}, {
        active: true
      })));
    case actionTypes.REGISTER_FIELD:
      return _objectSpread(_objectSpread({}, state), {}, _defineProperty({}, payload.field, _objectSpread({
        active: false,
        dirty: false,
        touched: false
      }, state[payload.field])));
    case actionTypes.SUBMIT_START:
      return Object.keys(state).reduce(function (result, key) {
        return _objectSpread(_objectSpread({}, result), {}, _defineProperty({}, key, _objectSpread(_objectSpread({}, state === null || state === void 0 ? void 0 : state[key]), {}, {
          dirty: true,
          touched: true
        })));
      }, {});
    case actionTypes.RESET:
      return Object.keys(state).reduce(function (result, key) {
        return _objectSpread(_objectSpread({}, result), {}, _defineProperty({}, key, _objectSpread(_objectSpread({}, state === null || state === void 0 ? void 0 : state[key]), {}, {
          active: false,
          dirty: false,
          touched: false
        })));
      }, {});
    default:
      return state;
  }
};

/**
 * `ErrorOptions` type.
 */

/**
 * Errors reducer.
 */

function errorsReducer(options) {
  var _validate;
  var action = options.action,
    state = options.state,
    validate = options.validate,
    values = options.values;
  switch (action.type) {
    case actionTypes.BLUR:
    case actionTypes.SET_FIELD_VALUE:
    case actionTypes.REGISTER_FIELD:
    case actionTypes.SUBMIT_START:
      return (_validate = validate(values)) !== null && _validate !== void 0 ? _validate : {};
    case actionTypes.RESET:
      return {};
    default:
      return state;
  }
}

/**
 * Submit status reducer.
 */

function submitStatusReducer(state, action) {
  switch (action.type) {
    case actionTypes.SUBMIT_START:
      return 'submitStart';
    case actionTypes.SUBMITTING:
      return 'submitting';
    case actionTypes.SUBMIT_FAILURE:
    case actionTypes.SUBMIT_SUCCESS:
      return 'idle';
    default:
      return state;
  }
}

/**
 * Is submitting reducer.
 */

function isSubmittingReducer(state, action) {
  switch (action.type) {
    case actionTypes.SUBMIT_START:
    case actionTypes.SUBMITTING:
      return true;
    case actionTypes.SUBMIT_FAILURE:
    case actionTypes.SUBMIT_SUCCESS:
      return false;
    default:
      return state;
  }
}

/**
 * Already submitted reducer.
 */

function alreadySubmittedReducer(state, action) {
  switch (action.type) {
    case actionTypes.SUBMIT_START:
    case actionTypes.SUBMITTING:
      return true;
    default:
      return state === undefined ? false : state;
  }
}

/**
 * Form reducer.
 */

var formReducer = function formReducer(validate, stateReducer) {
  return function (state, action) {
    if (isFieldRegistered(action, state)) {
      return state;
    }
    if (action.type === actionTypes.INIT) {
      return action.payload;
    }
    var fieldsValues = valuesReducer(state.fields.values, action);
    var fieldsMeta = metaReducer(state.fields.meta, action);
    var isSubmitting = isSubmittingReducer(state.isSubmitting, action);
    var submitStatus = submitStatusReducer(state.submitStatus, action);
    var alreadySubmitted = alreadySubmittedReducer(state.alreadySubmitted, action);
    var fieldsErrors = errorsReducer({
      action: action,
      state: state.fields.errors,
      validate: validate,
      values: fieldsValues
    });
    var fieldsMetaValues = Object.values(fieldsMeta);
    return stateReducer({
      alreadySubmitted: alreadySubmitted,
      fields: {
        errors: fieldsErrors,
        meta: fieldsMeta,
        values: fieldsValues
      },
      isSubmitting: isSubmitting,
      meta: {
        active: fieldsMetaValues.some(function (_ref) {
          var active = _ref.active;
          return active;
        }),
        dirty: fieldsMetaValues.some(function (_ref2) {
          var dirty = _ref2.dirty;
          return dirty;
        }),
        hasErrors: Object.entries(fieldsErrors).length > 0,
        touched: fieldsMetaValues.some(function (_ref3) {
          var touched = _ref3.touched;
          return touched;
        })
      },
      submitStatus: submitStatus
    }, action);
  };
};

/**
 * First state.
 */

var firstState = function firstState() {
  return {
    alreadySubmitted: false,
    fields: {
      errors: {},
      meta: {},
      values: {}
    },
    isFormReady: false,
    isSubmitting: false,
    meta: {
      active: false,
      dirty: false,
      hasErrors: false,
      touched: false
    },
    submitStatus: 'idle'
  };
};

/**
 * Initialize state.
 */

function initializeState(validate) {
  return function (initialValues) {
    var _validate2;
    var errors = (_validate2 = validate(initialValues)) !== null && _validate2 !== void 0 ? _validate2 : {};
    return {
      alreadySubmitted: false,
      fields: {
        errors: errors,
        meta: {},
        values: initialValues
      },
      isFormReady: true,
      isSubmitting: false,
      meta: {
        active: false,
        dirty: false,
        hasErrors: Object.entries(errors).length > 0,
        touched: false
      },
      submitStatus: 'idle'
    };
  };
}

/**
 * `Options` type.
 */

/**
 * Export `useForm`.
 */

function useForm(options) {
  var _options$initialValue = options.initialValues,
    initialValues = _options$initialValue === void 0 ? {} : _options$initialValue,
    jsonSchema = options.jsonSchema,
    onSubmit = options.onSubmit,
    onValuesChanged = options.onValuesChanged,
    _options$stateReducer = options.stateReducer,
    stateReducer = _options$stateReducer === void 0 ? _lodash.identity : _options$stateReducer,
    _options$validate = options.validate,
    validate = _options$validate === void 0 ? _validate3["default"] : _options$validate,
    validationOptions = options.validationOptions;
  var validateValues = (0, _react.useCallback)(function (values) {
    return validate(jsonSchema, values, validationOptions);
  }, [jsonSchema, validate, validationOptions]);
  var _useReducer = (0, _react.useReducer)(formReducer(validateValues, stateReducer), initialValues, firstState),
    _useReducer2 = _slicedToArray(_useReducer, 2),
    state = _useReducer2[0],
    dispatch = _useReducer2[1];
  (0, _react.useEffect)(function () {
    var defaultState = initializeState(validateValues);
    var timer = setTimeout(function () {
      clearTimeout(timer);
      dispatch({
        payload: defaultState(initialValues),
        type: actionTypes.INIT
      });
    }, 10);
  }, [dispatch, initialValues, validateValues]);
  var setFieldValue = (0, _react.useCallback)(function (field, value) {
    dispatch({
      payload: {
        field: field,
        value: value
      },
      type: actionTypes.SET_FIELD_VALUE
    });
  }, [dispatch]);
  var blurField = (0, _react.useCallback)(function (field) {
    dispatch({
      payload: {
        field: field
      },
      type: actionTypes.BLUR
    });
  }, [dispatch]);
  var focusField = (0, _react.useCallback)(function (field) {
    dispatch({
      payload: {
        field: field
      },
      type: actionTypes.FOCUS
    });
  }, [dispatch]);
  var registerField = (0, _react.useCallback)(function (field) {
    dispatch({
      payload: {
        field: field
      },
      type: actionTypes.REGISTER_FIELD
    });
  }, [dispatch]);
  var reset = (0, _react.useCallback)(function (formValues) {
    if (formValues) {
      return dispatch({
        payload: {
          initialValues: formValues
        },
        type: actionTypes.RESET
      });
    }
    return dispatch({
      payload: {
        initialValues: initialValues
      },
      type: actionTypes.RESET
    });
  }, [initialValues, dispatch]);
  var submit = (0, _react.useCallback)(function (event) {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }
    dispatch({
      payload: {},
      type: actionTypes.SUBMIT_START
    });
  }, [dispatch]);
  (0, _react.useEffect)(function () {
    if (onValuesChanged) {
      onValuesChanged(state.fields.values);
    }
  }, [state, onValuesChanged]);
  (0, _react.useEffect)(function () {
    if (state.submitStatus !== 'submitStart') {
      return;
    }
    dispatch({
      payload: {},
      type: actionTypes.SUBMITTING
    });
    if (Object.keys(state.fields.errors).length > 0) {
      dispatch({
        payload: {},
        type: actionTypes.SUBMIT_FAILURE
      });
      return;
    }
    Promise.resolve(onSubmit(state.fields.values, {
      reset: reset
    })).then(function () {
      dispatch({
        payload: {},
        type: actionTypes.SUBMIT_SUCCESS
      });
    }, function () {
      dispatch({
        payload: {},
        type: actionTypes.SUBMIT_FAILURE
      });
    });
  }, [dispatch, state, jsonSchema, onSubmit, reset]);
  var formActions = (0, _react.useMemo)(function () {
    return {
      reset: reset,
      submit: submit
    };
  }, [reset, submit]);
  var fieldActions = (0, _react.useMemo)(function () {
    return {
      blurField: blurField,
      focusField: focusField,
      registerField: registerField,
      setFieldValue: setFieldValue
    };
  }, [blurField, focusField, registerField, setFieldValue]);
  return {
    fieldActions: fieldActions,
    formActions: formActions,
    state: state
  };
}