// @flow

/**
 * Module dependencies.
 */

import { FieldActionsContext } from 'context/field-actions-context';
import { FormActionsContext } from 'context/form-actions-context';
import { FormStateContext } from 'context/form-state-context';
import type { Validate, ValidationOptions } from 'utils/validate';
import React, { type Node } from 'react';
import useForm, { type Action, type FormState, type Submit } from 'hooks/use-form';

/**
 * `Props` type.
 */

type Props = {
  children: Node | ({
    reset: () => void,
    submit: (event: ?SyntheticInputEvent<any>) => void
  }) => Node,
  initialValues?: Object,
  jsonSchema: Object,
  onFormValuesChanged?: (formState: Object) => void,
  onSubmit: Submit,
  stateReducer?: (state: FormState, action: Action) => FormState,
  validate?: Validate,
  validationOptions?: ValidationOptions
};

/**
 * `FormProvider` component.
 */

const FormProvider = (props: Props): Node => {
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
