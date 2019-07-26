// @flow

/**
 * Module dependencies.
 */

import { useCallback, useEffect } from 'react';
import { useFieldActions } from 'context/field-actions-context';
import { useFormState } from 'context/form-state-context';

/**
 * Export `useField`.
 */

export default function useField(field: string) {
  const { errors, meta, values } = useFormState();
  const {
    blurField,
    focusField,
    registerField,
    setFieldValue
  } = useFieldActions();

  useEffect(() => {
    registerField(field);
  }, [field, registerField]);

  const onChange = useCallback((value: any) => {
    setFieldValue(field, value);
  }, [field, setFieldValue]);

  const onBlur = useCallback(() => {
    blurField(field);
  }, [field, blurField]);

  const onFocus = useCallback(() => {
    focusField(field);
  }, [field, focusField]);

  return {
    error: errors?.[field] ?? null,
    meta: meta?.[field] ?? {},
    onBlur,
    onChange,
    onFocus,
    value: values?.[field]
  };
}
