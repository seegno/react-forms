// @flow

/**
 * Module dependencies.
 */

import { identity } from 'lodash';
import { useCallback, useEffect, useMemo, useReducer } from 'react';
import baseValidate, {
  type FieldError,
  type FieldErrors,
  type Validate,
  type ValidationOptions
} from 'utils/validate';

/**
 * Export `actionTypes`.
 */

export const actionTypes = {
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

export type Submit = (
  values: Object,
  actions: {
    reset: () => void
  }
) => Promise<any>;

/**
 * Export `Action` type.
 */

export type Action = {
  payload: Object,
  type: $Values<typeof actionTypes>
};

/**
 * Export `FieldMetaType` type.
 */

export type FieldMetaType = {
  active: boolean,
  dirty: boolean,
  touched: boolean
};

/**
 * Export `FormMetaType` type.
 */

export type FormMetaType = FieldMetaType & {
  hasErrors: boolean
};

/**
 * Export `FormState` type.
 */

export type FormState = {
  alreadySubmitted: boolean,
  fields: {
    errors: {
      [fieldName: string]: FieldError
    },
    meta: {
      [fieldName: string]: FieldMetaType
    },
    values: {
      [fieldName: string]: any
    }
  },
  isSubmitting: boolean,
  meta: FormMetaType,
  submitStatus: 'idle' | 'submitStart' | 'submitting'
};

/**
 * Is field registered.
 */

function isFieldRegistered(action, state) {
  return action.type === actionTypes.REGISTER_FIELD && state.fields.meta[action.payload.field];
}

/**
 * Values reducer.
 */

const valuesReducer = (state, action) => {
  const { payload, type } = action;

  switch (type) {
    case actionTypes.SET_FIELD_VALUE: {
      let newValue;

      if (typeof payload.value === 'function') {
        newValue = payload.value(state[payload.field]);
      } else {
        newValue = payload.value;
      }

      return {
        ...state,
        [payload.field]: newValue
      };
    }

    case actionTypes.REGISTER_FIELD:
      return {
        ...state,
        [payload.field]: state[payload.field]
      };

    case actionTypes.RESET:
      return payload.initialValues;

    default:
      return state;
  }
};

/**
 * Meta reducer.
 */

const metaReducer = (state, action) => {
  const { payload, type } = action;

  switch (type) {
    case actionTypes.BLUR:
      return {
        ...state,
        [payload.field]: {
          ...state[payload.field],
          active: false,
          touched: true
        }
      };

    case actionTypes.SET_FIELD_VALUE:
      if (payload.value === undefined) {
        return state;
      }

      return {
        ...state,
        [payload.field]: {
          ...state[payload.field],
          dirty: true
        }
      };

    case actionTypes.FOCUS:
      return {
        ...state,
        [payload.field]: {
          ...state[payload.field],
          active: true
        }
      };

    case actionTypes.REGISTER_FIELD:
      return {
        ...state,
        [payload.field]: {
          active: false,
          dirty: false,
          touched: false,
          ...state[payload.field]
        }
      };

    case actionTypes.SUBMIT_START:
      return Object.keys(state).reduce((result, key) => ({
        ...result,
        [key]: {
          ...state?.[key],
          dirty: true,
          touched: true
        }
      }), {});

    case actionTypes.RESET:
      return Object.keys(state).reduce((result, key) => ({
        ...result,
        [key]: {
          ...state?.[key],
          active: false,
          dirty: false,
          touched: false
        }
      }), {});

    default:
      return state;
  }
};

/**
 * `ErrorOptions` type.
 */

type ErrorOptions = {|
  action: Action,
  state: {
    [fieldName: string]: FieldError
  },
  validate: (values: Object) => FieldErrors,
  values: Object
|};

/**
 * Errors reducer.
 */

function errorsReducer(options: ErrorOptions) {
  const { action, state, validate, values } = options;

  switch (action.type) {
    case actionTypes.BLUR:
    case actionTypes.SET_FIELD_VALUE:
    case actionTypes.REGISTER_FIELD:
    case actionTypes.SUBMIT_START:
      return validate(values) ?? {};

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

const formReducer = (validate: Object => FieldErrors, stateReducer: (state: FormState, action: Action) => FormState) => {
  return (state: FormState, action: Action) => {
    if (isFieldRegistered(action, state)) {
      return state;
    }

    if (action.type === actionTypes.INIT) {
      return action.payload;
    }

    const fieldsValues = valuesReducer(state.fields.values, action);
    const fieldsMeta = metaReducer(state.fields.meta, action);
    const isSubmitting = isSubmittingReducer(state.isSubmitting, action);
    const submitStatus = submitStatusReducer(state.submitStatus, action);
    const alreadySubmitted = alreadySubmittedReducer(state.alreadySubmitted, action);
    const fieldsErrors = errorsReducer({
      action,
      state: state.fields.errors,
      validate,
      values: fieldsValues
    });

    const fieldsMetaValues: Array<Object> = Object.values(fieldsMeta);

    return stateReducer({
      alreadySubmitted,
      fields: {
        errors: fieldsErrors,
        meta: fieldsMeta,
        values: fieldsValues
      },
      isSubmitting,
      meta: {
        active: fieldsMetaValues.some(({ active }) => active),
        dirty: fieldsMetaValues.some(({ dirty }) => dirty),
        hasErrors: Object.entries(fieldsErrors).length > 0,
        touched: fieldsMetaValues.some(({ touched }) => touched)
      },
      submitStatus
    }, action);
  };
};

/**
 * First state.
 */

const firstState = () => ({
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
});

/**
 * Initialize state.
 */

function initializeState(validate: Validate) {
  return (initialValues: Object): FormState => {
    const errors = validate(initialValues) ?? {};

    return {
      alreadySubmitted: false,
      fields: {
        errors,
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

type Options = {|
  initialValues: Object,
  jsonSchema: Object,
  onSubmit: Submit,
  onValuesChanged?: (formState: Object) => void,
  stateReducer?: (state: FormState, action: Action) => FormState,
  validate?: Validate,
  validationOptions?: ValidationOptions
|};

/**
 * Export `useForm`.
 */

export default function useForm(options: Options) {
  const {
    initialValues = {},
    jsonSchema,
    onSubmit,
    onValuesChanged,
    stateReducer = identity,
    validate = baseValidate,
    validationOptions
  } = options;

  const validateValues = useCallback(values => {
    return validate(jsonSchema, values, validationOptions);
  }, [jsonSchema, validate, validationOptions]);

  const [state, dispatch] = useReducer(
    formReducer(validateValues, stateReducer),
    initialValues,
    firstState
  );

  useEffect(() => {
    const defaultState = initializeState(validateValues);

    const timer = setTimeout(() => {
      clearTimeout(timer);
      dispatch({
        payload: defaultState(initialValues),
        type: actionTypes.INIT
      });
    }, 10);
  }, [dispatch, initialValues, validateValues]);

  const setFieldValue = useCallback((field: string, value: any) => {
    dispatch({
      payload: { field, value },
      type: actionTypes.SET_FIELD_VALUE
    });
  }, [dispatch]);

  const blurField = useCallback((field: string) => {
    dispatch({
      payload: { field },
      type: actionTypes.BLUR
    });
  }, [dispatch]);

  const focusField = useCallback((field: string) => {
    dispatch({
      payload: { field },
      type: actionTypes.FOCUS
    });
  }, [dispatch]);

  const registerField = useCallback((field: string) => {
    dispatch({
      payload: { field },
      type: actionTypes.REGISTER_FIELD
    });
  }, [dispatch]);

  const reset = useCallback((formValues?: Object) => {
    if (formValues) {
      return dispatch({
        payload: { initialValues: formValues },
        type: actionTypes.RESET
      });
    }

    return dispatch({
      payload: { initialValues },
      type: actionTypes.RESET
    });
  }, [initialValues, dispatch]);

  const submit = useCallback((event: ?SyntheticEvent<any>) => {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }

    dispatch({
      payload: {},
      type: actionTypes.SUBMIT_START
    });
  }, [dispatch]);

  useEffect(() => {
    if (onValuesChanged) {
      onValuesChanged(state.fields.values);
    }
  }, [state, onValuesChanged]);

  useEffect(() => {
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

    Promise.resolve(onSubmit(state.fields.values, { reset })).then(
      () => {
        dispatch({
          payload: {},
          type: actionTypes.SUBMIT_SUCCESS
        });
      },
      () => {
        dispatch({
          payload: {},
          type: actionTypes.SUBMIT_FAILURE
        });
      }
    );
  }, [dispatch, state, jsonSchema, onSubmit, reset]);

  const formActions = useMemo(() => ({ reset, submit }), [reset, submit]);
  const fieldActions = useMemo(() => ({
    blurField,
    focusField,
    registerField,
    setFieldValue
  }), [blurField, focusField, registerField, setFieldValue]);

  return { fieldActions, formActions, state };
}
