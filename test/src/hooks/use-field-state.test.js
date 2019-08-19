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
      values: { foo: 'bar' }
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

  it('should return the field error', () => {
    const state = {
      errors: { foo: 'bar' }
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

  it('should return the field meta state', () => {
    const state = {
      meta: { foo: 'bar' }
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
});
