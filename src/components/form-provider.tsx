/**
 * Module dependencies.
 */

import { FieldActionsContext } from '../context/field-actions-context';
import { FormActionsContext } from '../context/form-actions-context';
import { FormStateContext } from '../context/form-state-context';
import { Validate, ValidationOptions } from '../utils/validate';
import React, { ReactNode, SyntheticEvent } from 'react';
import useForm, { Action, FormState, Submit } from '../hooks/use-form';

/**
 * `Props` type.
 */

type Props = {
  children: ReactNode | ((events: {
    reset: () => void,
    submit: (event: undefined | SyntheticEvent<any>) => void
  }) => ReactNode),
  initialValues?: object,
  jsonSchema: object,
  onFormValuesChanged?: (formState: object) => void,
  onSubmit: Submit,
  stateReducer?: (state: FormState, action: Action) => FormState,
  validate?: Validate,
  validationOptions?: ValidationOptions
};

/**
 * `FormProvider` component.
 */

const FormProvider = (props: Props): ReactNode => {
  const {
    children,
    initialValues,
    jsonSchema,
    onFormValuesChanged,
    onSubmit,
    stateReducer,
    validate,
    validationOptions
  } = props;

  const {
    fieldActions,
    formActions,
    state
  } = useForm({
    initialValues,
    jsonSchema,
    onSubmit,
    onValuesChanged: onFormValuesChanged,
    stateReducer,
    validate,
    validationOptions
  });

  return (
    <FieldActionsContext.Provider value={fieldActions}>
      <FormActionsContext.Provider value={formActions}>
        <FormStateContext.Provider value={state}>
          {typeof children === 'function' ? children(formActions) : children}
        </FormStateContext.Provider>
      </FormActionsContext.Provider>
    </FieldActionsContext.Provider>
  );
};

/**
 * Export `FormProvider` component.
 */

export default FormProvider;
