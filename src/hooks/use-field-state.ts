
/**
 * Module dependencies.
 */

import { Subscription, useSubscription } from 'use-subscription';
import { useDebugValue, useMemo } from 'react';
import { useFormControllerContext } from 'context/form-controller-context';

/**
 * Export `useFieldState`.
 */

export function useFieldState(fieldName: string) {
  const formState = useFormControllerContext();
  const subscription: Subscription<any> = useMemo(
    () => ({
      getCurrentValue: () => ({
        error: formState.getFieldError(fieldName),
        meta: formState.getFieldMeta(fieldName),
        value: formState.getFieldValue(fieldName)
      }),
      subscribe: callback => {
        const unsubscribe = formState.addFieldChangeListener(fieldName, callback);

        return () => unsubscribe();
      }
    }),
    [fieldName, formState]
  );

  const fieldState = useSubscription(subscription);

  useDebugValue(fieldState);

  return fieldState;
}
