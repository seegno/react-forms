
/**
 * Module dependencies.
 */

import { act, renderHook } from '@testing-library/react-hooks';
import useForm from 'hooks/use-form';

/**
 * `useForm` hook tests.
 */

describe('useForm hook', () => {
  it('should set the initial values', () => {
    const { result } = renderHook(() => useForm({
      initialValues: { foo: 'bar' },
      jsonSchema: { type: 'object' },
      onSubmit: () => Promise.resolve()
    }));

    expect(result.current.state.values).toEqual({
      foo: 'bar'
    });
  });

  it('should call `onValuesChanged` when the form values change', () => {
    const onValuesChanged = jest.fn();
    const { result } = renderHook(() => useForm({
      jsonSchema: { type: 'object' },
      onSubmit: () => Promise.resolve(),
      onValuesChanged
    }));

    act(() => {
      result.current.fieldActions.setFieldValue('foo', 'bar');
    });

    expect(onValuesChanged).toHaveBeenCalledWith({ foo: 'bar' });
  });

  describe('blurField', () => {
    it('should set the field to inactive and touched', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => Promise.resolve()
      }));

      act(() => {
        result.current.fieldActions.blurField('foo');
      });

      expect(result.current.state.meta.foo).toEqual({
        active: false,
        touched: true
      });
    });

    it('should validate the field value', () => {
      const { result } = renderHook(() => useForm({
        initialValues: { foo: 1 },
        jsonSchema: {
          properties: {
            foo: { type: 'string' }
          },
          type: 'object'
        },
        onSubmit: () => Promise.resolve()
      }));

      act(() => {
        result.current.fieldActions.blurField('foo');
      });

      expect(result.current.state.errors).toHaveProperty('foo');
    });
  });

  describe('focusField', () => {
    it('should set the field to active', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => Promise.resolve()
      }));

      act(() => {
        result.current.fieldActions.focusField('foo');
      });

      expect(result.current.state.meta.foo).toEqual({ active: true });
    });

    it('should not validate the form', () => {
      const { result } = renderHook(() => useForm({
        initialValues: { foo: 1 },
        jsonSchema: {
          properties: {
            foo: { type: 'string' }
          },
          type: 'object'
        },
        onSubmit: () => Promise.resolve()
      }));

      act(() => {
        result.current.fieldActions.focusField('foo');
      });

      expect(result.current.state.errors).toEqual({});
    });
  });

  describe('registerField', () => {
    it('should register the field', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => Promise.resolve()
      }));

      expect(result.current.state.values).not.toHaveProperty('foo');
      expect(result.current.state.meta).not.toHaveProperty('foo');

      act(() => {
        result.current.fieldActions.registerField('foo');
      });

      expect(result.current.state.values).toHaveProperty('foo');
      expect(result.current.state.meta).toHaveProperty('foo');
    });

    it('should keep initial values', () => {
      const { result } = renderHook(() => useForm({
        initialValues: { foo: 'bar' },
        jsonSchema: { type: 'object' },
        onSubmit: () => Promise.resolve()
      }));

      act(() => {
        result.current.fieldActions.registerField('foo');
      });

      expect(result.current.state.values).toEqual({ foo: 'bar' });
    });

    it('should not validate the form', () => {
      const { result } = renderHook(() => useForm({
        initialValues: { foo: 1 },
        jsonSchema: {
          properties: {
            foo: { type: 'string' }
          },
          type: 'object'
        },
        onSubmit: () => Promise.resolve()
      }));

      act(() => {
        result.current.fieldActions.registerField('foo');
      });

      expect(result.current.state.errors).toEqual({});
    });
  });

  describe('reset', () => {
    it('should clear the form values', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => Promise.resolve()
      }));

      act(() => {
        result.current.fieldActions.setFieldValue('foo', 'bar');
        result.current.formActions.reset();
      });

      expect(result.current.state.values).toEqual({});
    });

    it('should set the initial values', () => {
      const { result } = renderHook(() => useForm({
        initialValues: { foo: 'bar' },
        jsonSchema: { type: 'object' },
        onSubmit: () => Promise.resolve()
      }));

      act(() => {
        result.current.fieldActions.setFieldValue('foo', 'baz');
        result.current.formActions.reset();
      });

      expect(result.current.state.values).toEqual({ foo: 'bar' });
    });

    it('should clear the form errors', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: {
          properties: {
            foo: { type: 'string' }
          },
          type: 'object'
        },
        onSubmit: () => Promise.resolve()
      }));

      act(() => {
        result.current.fieldActions.setFieldValue('foo', 1);
        result.current.formActions.reset();
      });

      expect(result.current.state.errors).toEqual({});
    });

    it('should set all fields to inactive and untouched', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => Promise.resolve()
      }));

      act(() => {
        result.current.fieldActions.blurField('foo');
        result.current.fieldActions.focusField('foo');
        result.current.formActions.reset();
      });

      expect(result.current.state.meta).toEqual({
        foo: {
          active: false,
          touched: false
        }
      });
    });
  });

  describe('setFieldValue', () => {
    it('should set the field value', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => Promise.resolve()
      }));

      act(() => {
        result.current.fieldActions.setFieldValue('foo', 'bar');
      });

      expect(result.current.state.values).toEqual({ foo: 'bar' });
    });

    it('should validate the form', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: {
          properties: {
            foo: { type: 'string' }
          },
          type: 'object'
        },
        onSubmit: () => Promise.resolve()
      }));

      act(() => {
        result.current.fieldActions.setFieldValue('foo', 1);
      });

      expect(result.current.state.errors).toHaveProperty('foo');
    });
  });

  describe('submit', () => {
    it('should call the `onSubmit` option with the form values and actions', async () => {
      const onSubmit = jest.fn(() => Promise.resolve());
      const { result, waitForNextUpdate } = renderHook(() => useForm({
        initialValues: { foo: 'bar' },
        jsonSchema: { type: 'object' },
        onSubmit
      }));

      act(() => {
        result.current.formActions.submit();
      });

      await waitForNextUpdate();

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith({ foo: 'bar' }, {
        reset: expect.any(Function)
      });
    });

    it('should not call `onSubmit` when the form has errors', () => {
      const onSubmit = jest.fn(() => Promise.resolve());
      const { rerender, result } = renderHook(() => useForm({
        initialValues: { foo: 1 },
        jsonSchema: {
          properties: {
            foo: { type: 'string' }
          },
          type: 'object'
        },
        onSubmit
      }));

      act(() => {
        result.current.fieldActions.blurField('foo');
        result.current.formActions.submit();
      });

      // Force rerender to ensure effect is called.
      rerender();

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should set the `isSubmitting` flag', async () => {
      expect.assertions(2);

      const onSubmit = jest.fn(() => Promise.resolve());
      const { result, waitForNextUpdate } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit
      }));

      act(() => {
        result.current.formActions.submit();
      });

      expect(result.current.state.isSubmitting).toBe(true);

      await waitForNextUpdate();

      expect(result.current.state.isSubmitting).toBe(false);
    });

    it('should not reset the form values', async () => {
      const onSubmit = jest.fn(() => Promise.resolve());
      const { result, waitForNextUpdate } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit
      }));

      act(() => {
        result.current.fieldActions.setFieldValue('foo', 'bar');
        result.current.formActions.submit();
      });

      await waitForNextUpdate();

      expect(result.current.state.values).toEqual({ foo: 'bar' });
    });

    it('should set all fields to touched', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => Promise.resolve()
      }));

      act(() => {
        result.current.fieldActions.registerField('foo');
        result.current.formActions.submit();
      });

      await waitForNextUpdate();

      expect(result.current.state.meta).toEqual({
        foo: expect.objectContaining({
          touched: true
        })
      });
    });

    it('should validate the form', () => {
      const { result } = renderHook(() => useForm({
        initialValues: { foo: 1 },
        jsonSchema: {
          properties: {
            foo: { type: 'string' }
          },
          type: 'object'
        },
        onSubmit: () => Promise.resolve()
      }));

      act(() => {
        result.current.formActions.submit();
      });

      expect(result.current.state.errors).toHaveProperty('foo');
    });

    it('should reset the form if the passed `reset` action is called', async () => {
      const onSubmit = jest.fn((values, { reset }) => {
        reset();

        return Promise.resolve();
      });

      const { result, waitForNextUpdate } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit
      }));

      act(() => {
        result.current.fieldActions.setFieldValue('foo', 'bar');
        result.current.formActions.submit();
      });

      await waitForNextUpdate();

      expect(result.current.state.values).toEqual({});
    });
  });
});
