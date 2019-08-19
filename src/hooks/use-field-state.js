// @flow

/**
 * Module dependencies.
 */

import { useFormState } from 'context/form-state-context';

/**
 * Export `useFieldState`.
 */

export default function useFieldState(field: string) {
  const { errors, meta, values } = useFormState();

  return {
    error: errors?.[field] ?? null,
    meta: meta?.[field] ?? {},
    value: values?.[field]
  };
}
