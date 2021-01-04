/**
 * Module dependencies.
 */

import { createContext, useContext } from "react";

/**
 * `FieldActionsContextType` type.
 */

type FieldActionsContextType = {
  blurField: (fieldName: string) => void;
  focusField: (fieldName: string) => void;
  registerField: (fieldName: string) => void;
  setFieldValue: (fieldName: string, value: any) => void;
};

/**
 * Export `FieldActionsContext`.
 */

export const FieldActionsContext = createContext<FieldActionsContextType>({
  blurField: () => {},
  focusField: () => {},
  registerField: () => {},
  setFieldValue: () => {}
});

/**
 * Export `useFieldActions`.
 */

export function useFieldActions(): FieldActionsContextType {
  return useContext(FieldActionsContext);
}
