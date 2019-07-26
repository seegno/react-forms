// @flow

/**
 * Module dependencies.
 */

import { type Context, createContext, useContext } from 'react';

/**
 * `FormActionsContextType` type.
 */

type FormActionsContextType = {
  reset: () => void,
  submit: (event?: SyntheticInputEvent<any>) => void
};

/**
 * Export `FormActionsContext`.
 */

export const FormActionsContext: Context<FormActionsContextType> = createContext({
  reset: () => {},
  submit: () => {}
});

/**
 * Export `useFormActions`.
 */

export function useFormActions(): FormActionsContextType {
  return useContext(FormActionsContext);
}
