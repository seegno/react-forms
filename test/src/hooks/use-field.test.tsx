
/**
 * Module dependencies.
 */

import { FormProvider } from 'components/form-provider';
import { ReactNode } from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { useField } from 'hooks/use-field';

/**
 * `useField` hook tests.
 */

describe('useField', () => {
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

    const { result } = renderHook(() => useField('foo'), { wrapper: Wrapper });

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

    const { result } = renderHook(() => useField('foo'), { wrapper: Wrapper });

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

    const { result } = renderHook(() => useField('foo'), { wrapper: Wrapper });

    expect(result.current.meta).toEqual({
      active: false,
      dirty: false,
      touched: false
    });
  });

  it('should return an `onBlur` action that sets the field touched flag to true', () => {
    function Wrapper({ children }: { children?: ReactNode }) {
      return (
        <FormProvider
          jsonSchema={{}}
          onSubmit={() => {}}
        >
          {children}
        </FormProvider>
      );
    }

    const { result } = renderHook(() => useField('foo'), { wrapper: Wrapper });

    expect(result.current.meta.touched).toBe(false);

    act(() => {
      result.current.onBlur();
    });

    expect(result.current.meta.touched).toBe(true);
  });

  it('should return an `onFocus` action that the field active flag to true', () => {
    function Wrapper({ children }: { children?: ReactNode }) {
      return (
        <FormProvider
          jsonSchema={{}}
          onSubmit={() => {}}
        >
          {children}
        </FormProvider>
      );
    }

    const { result } = renderHook(() => useField('foo'), { wrapper: Wrapper });

    expect(result.current.meta.active).toBe(false);

    act(() => {
      result.current.onFocus();
    });

    expect(result.current.meta.active).toBe(true);
  });

  it('should return an `onChange` action that updates the field value with the provided value', () => {
    function Wrapper({ children }: { children?: ReactNode }) {
      return (
        <FormProvider
          initialValues={{ foo: 'bar' }}
          jsonSchema={{}}
          onSubmit={() => {}}
        >
          {children}
        </FormProvider>
      );
    }

    const { result } = renderHook(() => useField('foo'), { wrapper: Wrapper });

    expect(result.current.value).toBe('bar');

    act(() => {
      result.current.onChange('qux');
    });

    expect(result.current.value).toBe('qux');
  });
});
