/**
 * Module dependencies.
 */

import { createContext, useContext } from "react";
import { FormState } from "../hooks/use-form";

/**
 * Export `FormStateContext`.
 */

export const FormStateContext = createContext<FormState>({
  fields:  undefined,
  isSubmitting: false,
  meta: undefined,
  submitStatus: 'idle'
});

/**
 * Export `useFormState`.
 */

export function useFormState(): FormState {
  return useContext(FormStateContext);
}
