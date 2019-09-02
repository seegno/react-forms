"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = useForm;

var _react = require("react");

var _validate = _interopRequireDefault(require("../utils/validate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Action types.
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
        touched: true
      })));

    case actionTypes.FOCUS:
      return _objectSpread({}, state, _defineProperty({}, payload.field, _objectSpread({}, state[payload.field], {
        active: true,
        touched: true
      })));

    case actionTypes.REGISTER_FIELD:
      return _objectSpread({}, state, _defineProperty({}, payload.field, _objectSpread({
        active: false,
        touched: false
      }, state[payload.field])));

    case actionTypes.SUBMIT_START:
      return Object.keys(state).reduce(function (result, key) {
        return _objectSpread({}, result, _defineProperty({}, key, _objectSpread({}, state === null || state === void 0 ? void 0 : state[key], {
          touched: true
        })));
      }, {});

    case actionTypes.RESET:
      return Object.keys(state).reduce(function (result, key) {
        return _objectSpread({}, result, _defineProperty({}, key, _objectSpread({}, state === null || state === void 0 ? void 0 : state[key], {
          active: false,
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


var formReducer = function formReducer(jsonSchema) {
  return function (state, action) {
    var values = valuesReducer(state.values, action);
    var meta = metaReducer(state.meta, action);
    var errors = errorsReducer(state.errors, action, jsonSchema, values);
    var submitStatus = submitStatusReducer(state.submitStatus, action);
    var isSubmitting = isSubmittingReducer(state.isSubmitting, action);
    return {
      errors: errors,
      isSubmitting: isSubmitting,
      meta: meta,
      submitStatus: submitStatus,
      values: values
    };
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
      onValuesChanged = options.onValuesChanged;

  var _useReducer = (0, _react.useReducer)(formReducer(jsonSchema), {
    errors: {},
    isSubmitting: false,
    meta: {},
    submitStatus: 'idle',
    values: initialValues
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
      onValuesChanged(state.values);
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

    if (Object.keys(state.errors).length > 0) {
      dispatch({
        payload: {},
        type: actionTypes.SUBMIT_FAILURE
      });
      return;
    }

    Promise.resolve(onSubmit(state.values, {
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