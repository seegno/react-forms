// @flow

/**
 * Module dependencies.
 */

import { useCallback, useEffect } from 'react';
import { useFieldActions } from 'context/field-actions-context';
import useFieldState from './use-field-state';

/**
 * Export `useField`.
 */

export default function useField(field: string) {
  const { error, meta, value } = useFieldState(field);
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
    error,
    meta,
    onBlur,
    onChange,
    onFocus,
    value
  };
}
