// @flow

/**
 * Module dependencies.
 */

import { type Context, createContext, useContext } from 'react';
import type { FormState } from 'hooks/use-form';

/**
 * Export `FormStateContext`.
 */

export const FormStateContext: Context<FormState> = createContext({});

/**
 * Export `useFormState`.
 */

export function useFormState(): FormState {
  return useContext(FormStateContext);
}
