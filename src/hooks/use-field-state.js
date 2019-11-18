// @flow

/**
 * Module dependencies.
 */

import { useDebugValue } from 'react';
import { useFormState } from 'context/form-state-context';

/**
 * Export `useFieldState`.
 */

export default function useFieldState(field: string) {
  const { fields } = useFormState();
  const { errors, meta, values } = fields ?? {};
  const fieldState = {
    error: errors?.[field] ?? null,
    meta: meta?.[field] ?? {},
    value: values?.[field]
  };

  useDebugValue(fieldState);

  return fieldState;
}
