// @flow

/**
 * Module dependencies.
 */

import { useFormState } from 'context/form-state-context';

/**
 * Export `useFieldState`.
 */

export default function useFieldState(field: string) {
  const { fields } = useFormState();
  const { errors, meta, values } = fields ?? {};

  return {
    error: errors?.[field] ?? null,
    meta: meta?.[field] ?? {},
    value: values?.[field]
  };
}
