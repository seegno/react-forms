
/**
 * Module dependencies.
 */

import { FormController } from 'utils/form-controller';
import { createContext, useContext } from 'react';

/**
 * Form controller context.
 */

const FormControllerContext = createContext<FormController | null>(null);

/**
 * Export `FormControllerContextProvider` component.
 */

export const FormControllerContextProvider = FormControllerContext.Provider;

/**
 * Export `useFormControllerContext`.
 */

export function useFormControllerContext(): FormController {
  const formState = useContext(FormControllerContext);

  if (!formState) {
    throw new Error('useFormControllerContext must be used inside a FormProvider');
  }

  return formState;
}
