
/**
 * Module dependencies.
 */

import {
  FieldErrors,
  Validate,
  ValidationOptions,
  validate as baseValidate
} from 'utils/validate';

import { FormController } from 'utils/form-controller';
import {
  FormEvent,
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef
} from 'react';

import { Schema } from 'ajv';

/**
 * Export `Submit` type.
 */

export type Submit = (
  values: Record<string, unknown>,
  actions: {
    reset: () => void;
  }
) => Promise<any> | void;

/**
 * `Options` type.
 */

type Options = {
  initialValues?: Record<string, unknown>;
  jsonSchema: Schema;
  onSubmit: Submit;
  onValuesChanged?: (values: Record<string, any>) => void;
  // TODO: stateReducer?: (state: FormState, action: Action) => FormState,
  validate?: Validate;
  validationOptions?: ValidationOptions;
};

/**
 * Export `useForm`.
 */

export function useForm(options: Options) {
  const {
    initialValues = {},
    jsonSchema,
    onSubmit,
    onValuesChanged,
    // TODO: stateReducer = identity,
    validate = baseValidate,
    validationOptions
  } = options;

  const validateRef: MutableRefObject<
    ((values: Record<string, any>) => FieldErrors)
  > = useRef(() => ({}));

  validateRef.current = values => {
    return validate(jsonSchema, values, validationOptions);
  };

  const formStateRef = useRef(new FormController({
    getValidate: () => validateRef.current,
    initialValues
  }));

  const reset = useCallback((newValues?: Record<string, any>): void => {
    formStateRef.current.reset(newValues ?? initialValues);
  }, [initialValues]);

  const submit = useCallback((event?: FormEvent): void => {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }

    formStateRef.current.submitTo(values => onSubmit(values, { reset }));
  }, [onSubmit, reset]);

  const formActions = useMemo(() => ({ reset, submit }), [reset, submit]);

  useEffect(() => {
    if (!onValuesChanged) {
      return;
    }

    const unsubscribe = formStateRef.current.addFormValuesListener(() => {
      onValuesChanged(formStateRef.current.getValues());
    });

    return () => unsubscribe();
  }, [onValuesChanged]);

  return useMemo(() => ({
    fieldActions: {
      blurField: (fieldName: string) => {
        formStateRef.current.blurField(fieldName);
      },
      focusField: (fieldName: string) => {
        formStateRef.current.focusField(fieldName);
      },
      registerField: (fieldName: string) => {
        formStateRef.current.registerField(fieldName);
      },
      setFieldValue: (fieldName: string, value: any) => {
        formStateRef.current.setFieldValue(fieldName, value);
      }
    },
    formActions,
    formState: formStateRef.current
  }), [formActions]);
}
