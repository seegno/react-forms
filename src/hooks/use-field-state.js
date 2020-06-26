// @flow

/**
 * Module dependencies.
 */

import { get } from 'lodash';
import { useDebugValue } from 'react';
import { useFormState } from 'context/form-state-context';

/**
 * Export `useFieldState`.
 */

export default function useFieldState(field: string) {
  const { fields } = useFormState();
  const { errors, meta, values } = fields ?? {};
  const fieldState = {
    error: get(errors, field, null),
    meta: get(meta, field, {}),
    value: get(values, field)
  };

  useDebugValue(fieldState);

  return fieldState;
}
