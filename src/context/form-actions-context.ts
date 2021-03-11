/**
 * Module dependencies.
 */

import { createContext, useContext, SyntheticEvent } from "react";

/**
 * `FormActionsContextType` type.
 */

type FormActionsContextType = {
  reset: () => void;
  submit: (event?: SyntheticEvent<any>) => void;
};

/**
 * Export `FormActionsContext`.
 */

export const FormActionsContext = createContext<FormActionsContextType>({
  reset: () => {},
  submit: () => {}
});

/**
 * Export `useFormActions`.
 */

export function useFormActions(): FormActionsContextType {
  return useContext(FormActionsContext);
}
