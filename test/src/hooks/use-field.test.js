
/**
 * Module dependencies.
 */

import { FieldActionsContext } from 'context/field-actions-context';
import { FormStateContext } from 'context/form-state-context';
import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import useField from 'hooks/use-field';

/**
 * `useField` hook tests.
 */

describe('useField', () => {
  let actions;

  beforeEach(() => {
    actions = {
      blurField: jest.fn(),
      focusField: jest.fn(),
      registerField: jest.fn(),
      setFieldValue: jest.fn()
    };
  });

  it('should return the field value', () => {
    const state = {
      values: { foo: 'bar' }
    };

    const Wrapper = ({ children }) => (
      <FieldActionsContext.Provider value={actions}>
        <FormStateContext.Provider value={state}>
          {children}
        </FormStateContext.Provider>
      </FieldActionsContext.Provider>
    );

    const { result } = renderHook(() => useField('foo'), { wrapper: Wrapper });

    expect(result.current.value).toBe('bar');
  });

  it('should return the field error', () => {
    const state = {
      errors: { foo: 'bar' }
    };

    const Wrapper = ({ children }) => (
      <FieldActionsContext.Provider value={actions}>
        <FormStateContext.Provider value={state}>
          {children}
        </FormStateContext.Provider>
      </FieldActionsContext.Provider>
    );

    const { result } = renderHook(() => useField('foo'), { wrapper: Wrapper });

    expect(result.current.error).toBe('bar');
  });

  it('should return the field meta state', () => {
    const state = {
      meta: { foo: 'bar' }
    };

    const Wrapper = ({ children }) => (
      <FieldActionsContext.Provider value={actions}>
        <FormStateContext.Provider value={state}>
          {children}
        </FormStateContext.Provider>
      </FieldActionsContext.Provider>
    );

    const { result } = renderHook(() => useField('foo'), { wrapper: Wrapper });

    expect(result.current.meta).toBe('bar');
  });

  it('should return an `onBlur` action that calls the `blurField` form action with the field name', () => {
    const Wrapper = ({ children }) => (
      <FieldActionsContext.Provider value={actions}>
        <FormStateContext.Provider value={{}}>
          {children}
        </FormStateContext.Provider>
      </FieldActionsContext.Provider>
    );

    const { result } = renderHook(() => useField('foo'), { wrapper: Wrapper });

    result.current.onBlur();

    expect(actions.blurField).toHaveBeenCalledTimes(1);
    expect(actions.blurField).toHaveBeenCalledWith('foo');
  });

  it('should return an `onFocus` action that calls the `focusField` form action with the field name', () => {
    const Wrapper = ({ children }) => (
      <FieldActionsContext.Provider value={actions}>
        <FormStateContext.Provider value={{}}>
          {children}
        </FormStateContext.Provider>
      </FieldActionsContext.Provider>
    );

    const { result } = renderHook(() => useField('foo'), { wrapper: Wrapper });

    result.current.onFocus();

    expect(actions.focusField).toHaveBeenCalledTimes(1);
    expect(actions.focusField).toHaveBeenCalledWith('foo');
  });

  it('should return an `onChange` action that calls the `setFieldValue` form action with the field name and the provided value', () => {
    const Wrapper = ({ children }) => (
      <FieldActionsContext.Provider value={actions}>
        <FormStateContext.Provider value={{}}>
          {children}
        </FormStateContext.Provider>
      </FieldActionsContext.Provider>
    );

    const { result } = renderHook(() => useField('foo'), { wrapper: Wrapper });

    result.current.onChange('bar');

    expect(actions.setFieldValue).toHaveBeenCalledTimes(1);
    expect(actions.setFieldValue).toHaveBeenCalledWith('foo', 'bar');
  });
});
