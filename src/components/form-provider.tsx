
/**
 * Module dependencies.
 */

import { FormControllerContextProvider } from 'context/form-controller-context';
import { FormEvent, ReactNode } from 'react';
import { Submit, useForm } from 'hooks/use-form';
import { Validate, ValidationOptions } from 'utils/validate';

/**
 * `FormActions` type.
 */

type FormActions = {
  reset: () => void;
  submit: (event?: FormEvent) => void;
};

/**
 * `Props` type.
 */

type Props = {
  children: ReactNode | ((formActions: FormActions) => ReactNode);
  initialValues?: Record<string, unknown>;
  jsonSchema: Record<string, unknown>;
  // TODO: onFormValuesChanged?: (formState: Object) => void,
  onSubmit: Submit;
  // TODO: stateReducer?: (state: FormState, action: Action) => FormState,
  validate?: Validate;
  validationOptions?: ValidationOptions;
};

/**
 * Export `FormProvider` component.
 */

export function FormProvider(props: Props): JSX.Element {
  const {
    children,
    initialValues,
    jsonSchema,
    onSubmit,
    validate,
    validationOptions
  } = props;

  const { formActions, formState } = useForm({
    initialValues,
    jsonSchema,
    onSubmit,
    validate,
    validationOptions
  });

  return (
    <FormControllerContextProvider value={formState}>
      {typeof children === 'function' ? children(formActions) : children}
    </FormControllerContextProvider>
  );
}
