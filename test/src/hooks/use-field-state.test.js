/**
 * Module dependencies.
 */

import { FormStateContext } from 'context/form-state-context';
import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import useFieldState from 'hooks/use-field-state';

/**
 * `useFieldState` hook tests.
 */

describe('useFieldState', () => {
  it('should return the field value', () => {
    const state = {
      fields: {
        values: { foo: 'bar' }
      }
    };

    const Wrapper = ({ children }) => (
      <FormStateContext.Provider value={state}>
        {children}
      </FormStateContext.Provider>
    );

    const { result } = renderHook(() => useFieldState('foo'), {
      wrapper: Wrapper
    });

    expect(result.current.value).toBe('bar');
  });

  it('should return the nested field value', () => {
    const state = {
      fields: {
        values: {
          foo: {
            bar: 'baz'
          }
        }
      }
    };

    const Wrapper = ({ children }) => (
      <FormStateContext.Provider value={state}>
        {children}
      </FormStateContext.Provider>
    );

    const { result } = renderHook(() => useFieldState('foo.bar'), {
      wrapper: Wrapper
    });

    expect(result.current.value).toBe('baz');
  });

  it('should return the field error', () => {
    const state = {
      fields: {
        errors: { foo: 'bar' }
      }
    };

    const Wrapper = ({ children }) => (
      <FormStateContext.Provider value={state}>
        {children}
      </FormStateContext.Provider>
    );

    const { result } = renderHook(() => useFieldState('foo'), {
      wrapper: Wrapper
    });

    expect(result.current.error).toBe('bar');
  });

  it('should return the nested field error', () => {
    const state = {
      fields: {
        errors: {
          foo: {
            bar: 'baz'
          }
        }
      }
    };

    const Wrapper = ({ children }) => (
      <FormStateContext.Provider value={state}>
        {children}
      </FormStateContext.Provider>
    );

    const { result } = renderHook(() => useFieldState('foo.bar'), {
      wrapper: Wrapper
    });

    expect(result.current.error).toBe('baz');
  });

  it('should return the field meta state', () => {
    const state = {
      fields: {
        meta: { foo: 'bar' }
      }
    };

    const Wrapper = ({ children }) => (
      <FormStateContext.Provider value={state}>
        {children}
      </FormStateContext.Provider>
    );

    const { result } = renderHook(() => useFieldState('foo'), {
      wrapper: Wrapper
    });

    expect(result.current.meta).toBe('bar');
  });

  it('should return the nested field meta state', () => {
    const state = {
      fields: {
        meta: {
          foo: {
            bar: 'baz'
          }
        }
      }
    };

    const Wrapper = ({ children }) => (
      <FormStateContext.Provider value={state}>
        {children}
      </FormStateContext.Provider>
    );

    const { result } = renderHook(() => useFieldState('foo.bar'), {
      wrapper: Wrapper
    });

    expect(result.current.meta).toBe('baz');
  });
});
