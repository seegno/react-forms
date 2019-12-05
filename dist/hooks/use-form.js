"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = useForm;
exports.actionTypes = void 0;

var _lodash = require("lodash");

var _react = require("react");

var _validate = _interopRequireDefault(require("../utils/validate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Export `actionTypes`.
 */
var actionTypes = {
  BLUR: 'BLUR',
  FOCUS: 'FOCUS',
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

exports.actionTypes = actionTypes;

/**
 * Values reducer.
 */
var valuesReducer = function valuesReducer(state, action) {
  var payload = action.payload,
      type = action.type;

  switch (type) {
    case actionTypes.SET_FIELD_VALUE:
      return _objectSpread({}, state, _defineProperty({}, payload.field, payload.value));

    case actionTypes.REGISTER_FIELD:
      return _objectSpread({}, state, _defineProperty({}, payload.field, state[payload.field]));

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
      return _objectSpread({}, state, _defineProperty({}, payload.field, _objectSpread({}, state[payload.field], {
        active: false,
        dirty: true,
        touched: true
      })));

    case actionTypes.SET_FIELD_VALUE:
      return _objectSpread({}, state, _defineProperty({}, payload.field, _objectSpread({}, state[payload.field], {
        dirty: true
      })));

    case actionTypes.FOCUS:
      return _objectSpread({}, state, _defineProperty({}, payload.field, _objectSpread({}, state[payload.field], {
        active: true,
        dirty: true
      })));

    case actionTypes.REGISTER_FIELD:
      return _objectSpread({}, state, _defineProperty({}, payload.field, _objectSpread({
        active: false,
        touched: false
      }, state[payload.field])));

    case actionTypes.SUBMIT_START:
      return Object.keys(state).reduce(function (result, key) {
        return _objectSpread({}, result, _defineProperty({}, key, _objectSpread({}, state === null || state === void 0 ? void 0 : state[key], {
          dirty: true,
          touched: true
        })));
      }, {});

    case actionTypes.RESET:
      return Object.keys(state).reduce(function (result, key) {
        return _objectSpread({}, result, _defineProperty({}, key, _objectSpread({}, state === null || state === void 0 ? void 0 : state[key], {
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
 * Errors reducer.
 */


function errorsReducer(state, action, jsonSchema, values) {
  switch (action.type) {
    case actionTypes.BLUR:
    case actionTypes.SET_FIELD_VALUE:
    case actionTypes.REGISTER_FIELD:
    case actionTypes.SUBMIT_START:
      return (0, _validate["default"])(jsonSchema, values);

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
 * Form reducer.
 */


var formReducer = function formReducer(jsonSchema, stateReducer) {
  return function (state, action) {
    var fieldsValues = valuesReducer(state.fields.values, action);
    var fieldsErrors = errorsReducer(state.fields.errors, action, jsonSchema, fieldsValues);
    var fieldsMeta = metaReducer(state.fields.meta, action);
    var isSubmitting = isSubmittingReducer(state.isSubmitting, action);
    var submitStatus = submitStatusReducer(state.submitStatus, action);
    var fieldsMetaValues = Object.values(fieldsMeta);
    return stateReducer({
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
        hasErrors: Object.entries(fieldsErrors).length > 0,
        touched: fieldsMetaValues.some(function (_ref2) {
          var touched = _ref2.touched;
          return touched;
        })
      },
      submitStatus: submitStatus
    }, action);
  };
};
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
      stateReducer = _options$stateReducer === void 0 ? _lodash.identity : _options$stateReducer;

  var _useReducer = (0, _react.useReducer)(formReducer(jsonSchema, stateReducer), {
    fields: {
      errors: {},
      meta: {},
      values: initialValues
    },
    isSubmitting: false,
    meta: {
      active: false,
      hasErrors: false,
      touched: false
    },
    submitStatus: 'idle'
  }),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];

  var setFieldValue = (0, _react.useCallback)(function (field, value) {
    dispatch({
      payload: {
        field: field,
        value: value
      },
      type: actionTypes.SET_FIELD_VALUE
    });
  }, []);
  var blurField = (0, _react.useCallback)(function (field) {
    dispatch({
      payload: {
        field: field
      },
      type: actionTypes.BLUR
    });
  }, []);
  var focusField = (0, _react.useCallback)(function (field) {
    dispatch({
      payload: {
        field: field
      },
      type: actionTypes.FOCUS
    });
  }, []);
  var registerField = (0, _react.useCallback)(function (field) {
    dispatch({
      payload: {
        field: field
      },
      type: actionTypes.REGISTER_FIELD
    });
  }, []);
  var reset = (0, _react.useCallback)(function () {
    dispatch({
      payload: {
        initialValues: initialValues
      },
      type: actionTypes.RESET
    });
  }, [initialValues]);
  var submit = (0, _react.useCallback)(function (event) {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }

    dispatch({
      payload: {},
      type: actionTypes.SUBMIT_START
    });
  }, []);
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
  }, [state, jsonSchema, onSubmit, reset]);
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