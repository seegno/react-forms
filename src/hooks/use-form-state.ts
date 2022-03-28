
/**
 * Module dependencies.
 */

import { FieldMeta, SubmitStatus } from 'utils/form-controller';
import { Subscription, useSubscription } from 'use-subscription';
import { useFormControllerContext } from 'context/form-controller-context';
import { useMemo } from 'react';

/**
 * `FormMeta` type.
 */

type FormMeta = FieldMeta & {
  hasErrors: boolean;
};

/**
 * Export `useFormState`.
 */

export function useFormState(): { isSubmitting: boolean; meta: FormMeta; submitStatus: SubmitStatus } {
  const formState = useFormControllerContext();
  const subscription: Subscription<any> = useMemo(
    () => ({
      getCurrentValue: () => ({
        meta: formState.getMeta(),
        submitStatus: formState.getSubmitStatus()
      }),
      subscribe: callback => {
        const unsubscribe = formState.addFormValuesListener(callback);

        return () => unsubscribe();
      }
    }),
    [formState]
  );

  const {
    meta,
    submitStatus
  } = useSubscription(subscription);

  return {
    isSubmitting: submitStatus === SubmitStatus.Submitting,
    meta,
    submitStatus
  };
}
