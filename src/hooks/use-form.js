// @flow

/**
 * Module dependencies.
 */

import { get, identity, isEmpty, set } from 'lodash';
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
 * Values reducer.
 */

const valuesReducer = (state, action) => {
  const { payload, type } = action;

  switch (type) {
    case actionTypes.SET_FIELD_VALUE:
      return {
        ...state,
        ...set({}, payload.field, payload.value)
      };

    case actionTypes.REGISTER_FIELD:
      return {
        ...state,
        ...set({}, payload.field, get(state, payload.field))
      };

    case actionTypes.RESET:
      return payload.initialValues;

    default:
      return state;
  }
};

/**
 * Field meta keys.
 */

const fieldMetaKeys = ['active', 'dirty', 'touched'];

/**
 * Get nested keys.
 */

function getNestedKeys(state: Object, allKeys: Array<string>): Array<string> {
  return Object.keys(state).reduce((acc, key) => {
    if (fieldMetaKeys.includes(key)) {
      return acc;
    }

    acc.push(key);

    return getNestedKeys(state[key], acc);
  }, allKeys);
}

/**
 * Meta reducer.
 */

const metaReducer = (state, action) => {
  const { payload, type } = action;

  switch (type) {
    case actionTypes.BLUR:
      return {
        ...state,
        ...set({}, payload.field, {
          ...get(state, payload.field),
          active: false,
          touched: true
        })
      };

    case actionTypes.SET_FIELD_VALUE:
      return {
        ...state,
        ...set({}, payload.field, {
          ...get(state, payload.field),
          dirty: true
        })
      };

    case actionTypes.FOCUS:
      return {
        ...state,
        ...set({}, payload.field, {
          ...get(state, payload.field),
          active: true
        })
      };

    case actionTypes.REGISTER_FIELD:
      return {
        ...state,
        ...set({}, payload.field, {
          ...get(state, payload.field),
          active: false,
          dirty: false,
          touched: false
        })
      };

    case actionTypes.SUBMIT_START: {
      const path = getNestedKeys(state, []).join('.');

      return {
        ...set({}, path, {
          ...get(state, path),
          active: false,
          dirty: false,
          touched: true
        })
      };
    }

    case actionTypes.RESET: {
      const path = getNestedKeys(state, []).join('.');

      return {
        ...set({}, path, {
          ...get(state, path),
          active: false,
          dirty: false,
          touched: false
        })
      };
    }

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
 * Form reducer.
 */

const formReducer = (validate: Object => FieldErrors, stateReducer: (state: FormState, action: Action) => FormState) => {
  return (state: FormState, action: Action) => {
    const fieldsValues = valuesReducer(state.fields.values, action);
    const fieldsMeta = metaReducer(state.fields.meta, action);
    const isSubmitting = isSubmittingReducer(state.isSubmitting, action);
    const submitStatus = submitStatusReducer(state.submitStatus, action);
    const fieldsErrors = errorsReducer({
      action,
      state: state.fields.errors,
      validate,
      values: fieldsValues
    });

    const fieldsMetaValues: Array<Object> = Object.values(fieldsMeta);

    return stateReducer({
      fields: {
        errors: fieldsErrors,
        meta: fieldsMeta,
        values: fieldsValues
      },
      isSubmitting,
      meta: {
        active: fieldsMetaValues.some(element => {
          const nestedKeys = getNestedKeys(element, []);

          if (!isEmpty(nestedKeys)) {
            const path = nestedKeys.join('.');

            return get(element, path).active;
          }

          return element.active;
        }),
        dirty: fieldsMetaValues.some(element => {
          const nestedKeys = getNestedKeys(element, []);

          if (!isEmpty(nestedKeys)) {
            const path = nestedKeys.join('.');

            return get(element, path).dirty;
          }

          return element.dirty;
        }),
        hasErrors: Object.entries(fieldsErrors).length > 0,
        touched: fieldsMetaValues.some(element => {
          const nestedKeys = getNestedKeys(element, []);

          if (!isEmpty(nestedKeys)) {
            const path = nestedKeys.join('.');

            return get(element, path).touched;
          }

          return element.touched;
        })
      },
      submitStatus
    }, action);
  };
};

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

  const validateValues = values => validate(jsonSchema, values, validationOptions);
  const [state, dispatch] = useReducer(
    formReducer(validateValues, stateReducer),
    {
      fields: {
        errors: {},
        meta: {},
        values: initialValues
      },
      isSubmitting: false,
      meta: {
        active: false,
        dirty: false,
        hasErrors: false,
        touched: false
      },
      submitStatus: 'idle'
    }
  );

  const setFieldValue = useCallback((field: string, value: any) => {
    dispatch({
      payload: { field, value },
      type: actionTypes.SET_FIELD_VALUE
    });
  }, []);

  const blurField = useCallback((field: string) => {
    dispatch({
      payload: { field },
      type: actionTypes.BLUR
    });
  }, []);

  const focusField = useCallback((field: string) => {
    dispatch({
      payload: { field },
      type: actionTypes.FOCUS
    });
  }, []);

  const registerField = useCallback((field: string) => {
    dispatch({
      payload: { field },
      type: actionTypes.REGISTER_FIELD
    });
  }, []);

  const reset = useCallback(() => {
    dispatch({
      payload: { initialValues },
      type: actionTypes.RESET
    });
  }, [initialValues]);

  const submit = useCallback((event: ?SyntheticEvent<any>) => {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }

    dispatch({
      payload: {},
      type: actionTypes.SUBMIT_START
    });
  }, []);

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
  }, [state, jsonSchema, onSubmit, reset]);

  const formActions = useMemo(() => ({ reset, submit }), [reset, submit]);
  const fieldActions = useMemo(() => ({
    blurField,
    focusField,
    registerField,
    setFieldValue
  }), [blurField, focusField, registerField, setFieldValue]);

  return { fieldActions, formActions, state };
}
