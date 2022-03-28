
/**
 * Module dependencies.
 */

import { useCallback, useDebugValue } from 'react';
import { useFieldState } from './use-field-state';
import { useFormControllerContext } from 'context/form-controller-context';

/**
 * Export `useField`.
 */

export function useField(fieldName: string) {
  const fieldState = useFieldState(fieldName);
  const formState = useFormControllerContext();
  const onChange = useCallback(value => {
    formState.setFieldValue(fieldName, value);
  }, [fieldName, formState]);

  const onFocus = useCallback(() => {
    formState.focusField(fieldName);
  }, [fieldName, formState]);

  const onBlur = useCallback(() => {
    formState.blurField(fieldName);
  }, [fieldName, formState]);

  useDebugValue(fieldState.value);

  return {
    ...fieldState,
    onBlur,
    onChange,
    onFocus
  };
}
