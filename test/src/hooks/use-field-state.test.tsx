/**
 * Module dependencies.
 */

import { FormProvider } from 'components/form-provider';
import { ReactNode } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useFieldState } from 'hooks/use-field-state';

/**
 * `useFieldState` hook tests.
 */

describe('useFieldState', () => {
  it('should return the field value', () => {
    const values = { foo: 'bar' };

    function Wrapper({ children }: { children?: ReactNode }) {
      return (
        <FormProvider
          initialValues={values}
          jsonSchema={{}}
          onSubmit={() => {}}
        >
          {children}
        </FormProvider>
      );
    }

    const { result } = renderHook(() => useFieldState('foo'), { wrapper: Wrapper });

    expect(result.current.value).toBe('bar');
  });

  it('should return the field error', () => {
    const values = { foo: 'bar' };

    function Wrapper({ children }: { children?: ReactNode }) {
      return (
        <FormProvider
          initialValues={values}
          jsonSchema={{
            properties: {
              foo: { type: 'number' }
            },
            type: 'object'
          }}
          onSubmit={() => {}}
        >
          {children}
        </FormProvider>
      );
    }

    const { result } = renderHook(() => useFieldState('foo'), { wrapper: Wrapper });

    expect(result.current.error).toMatchObject({ rule: 'type' });
  });

  it('should return the field meta state', () => {
    const values = { foo: 'bar' };

    function Wrapper({ children }: { children?: ReactNode }) {
      return (
        <FormProvider
          initialValues={values}
          jsonSchema={{}}
          onSubmit={() => {}}
        >
          {children}
        </FormProvider>
      );
    }

    const { result } = renderHook(() => useFieldState('foo'), { wrapper: Wrapper });

    expect(result.current.meta).toEqual({
      active: false,
      dirty: false,
      touched: false
    });
  });
});
