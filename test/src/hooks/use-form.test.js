
/**
 * Module dependencies.
 */

import { act, renderHook } from '@testing-library/react-hooks';
import { merge } from 'lodash';
import useForm, { actionTypes } from 'hooks/use-form';
import validate from 'utils/validate';

/**
 * `useForm` hook tests.
 */

describe('useForm hook', () => {
  it('should set the initial values', async () => {
    const { result, waitFor } = renderHook(() => useForm({
      initialValues: { foo: 'bar' },
      jsonSchema: { type: 'object' },
      onSubmit: () => {}
    }));

    await waitFor(() => {
      expect(result.current.state.isFormReady).toEqual(true);
    });

    expect(result.current.state.fields.values).toEqual({
      foo: 'bar'
    });
  });

  it('should start as not active, not dirty, not touched and without errors', () => {
    const { result } = renderHook(() => useForm({
      jsonSchema: { type: 'object' },
      onSubmit: () => {}
    }));

    expect(result.current.state.meta).toEqual({
      active: false,
      dirty: false,
      hasErrors: false,
      touched: false
    });
  });

  it('should validate the initial values', async () => {
    const { result, waitFor } = renderHook(() => useForm({
      initialValues: {},
      jsonSchema: {
        required: ['foo'],
        type: 'object'
      },
      onSubmit: () => {}
    }));

    await waitFor(() => {
      expect(result.current.state.isFormReady).toEqual(true);
    });

    expect(result.current.state.fields.errors).toHaveProperty('foo');
    expect(result.current.state.meta).toEqual({
      active: false,
      dirty: false,
      hasErrors: true,
      touched: false
    });
  });

  it('should call `onValuesChanged` when the form values change', () => {
    const onValuesChanged = jest.fn();
    const { result } = renderHook(() => useForm({
      jsonSchema: { type: 'object' },
      onSubmit: () => {},
      onValuesChanged
    }));

    act(() => {
      result.current.fieldActions.setFieldValue('foo', 'bar');
    });

    expect(onValuesChanged).toHaveBeenCalledWith({ foo: 'bar' });
  });

  describe('blurField', () => {
    it('should set the field to inactive and touched', async () => {
      const { result, waitFor } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      await waitFor(() => {
        expect(result.current.state.isFormReady).toEqual(true);
      });

      act(() => {
        result.current.fieldActions.blurField('foo');
      });

      expect(result.current.state.fields.meta.foo).toEqual({
        active: false,
        touched: true
      });
    });

    it('should validate the field value', async () => {
      const { result, waitFor } = renderHook(() => useForm({
        initialValues: { foo: 1 },
        jsonSchema: {
          properties: {
            foo: { type: 'string' }
          },
          type: 'object'
        },
        onSubmit: () => {}
      }));

      await waitFor(() => {
        expect(result.current.state.isFormReady).toEqual(true);
      });

      act(() => {
        result.current.fieldActions.blurField('foo');
      });

      expect(result.current.state.fields.errors).toHaveProperty('foo');
    });
  });

  describe('focusField', () => {
    it('should set the field to active', async () => {
      const { result, waitFor } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      await waitFor(() => {
        expect(result.current.state.isFormReady).toEqual(true);
      });

      act(() => {
        result.current.fieldActions.focusField('foo');
      });

      expect(result.current.state.fields.meta.foo).toEqual({
        active: true
      });
    });

    it('should not validate the form', async () => {
      const mockValidate = jest.fn(validate);
      const { result, waitFor } = renderHook(() => useForm({
        initialValues: { foo: 1 },
        jsonSchema: {
          properties: {
            foo: { type: 'string' }
          },
          type: 'object'
        },
        onSubmit: () => {},
        validate: mockValidate
      }));

      await waitFor(() => {
        expect(result.current.state.isFormReady).toEqual(true);
      });

      // Reset mock calls, because initialization calls `validate`.
      mockValidate.mockReset();

      act(() => {
        result.current.fieldActions.focusField('foo');
      });

      expect(mockValidate).not.toHaveBeenCalled();
    });
  });

  describe('registerField', () => {
    it('should register the field', async () => {
      const { result, waitFor } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      await waitFor(() => {
        expect(result.current.state.isFormReady).toEqual(true);
      });

      expect(result.current.state.fields.values).not.toHaveProperty('foo');
      expect(result.current.state.fields.meta).not.toHaveProperty('foo');

      act(() => {
        result.current.fieldActions.registerField('foo');
      });

      expect(result.current.state.fields.values).toHaveProperty('foo');
      expect(result.current.state.fields.meta).toHaveProperty('foo');
    });

    it('should not re-register the field', async () => {
      const { result, waitFor } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      await waitFor(() => {
        expect(result.current.state.isFormReady).toEqual(true);
      });

      act(() => {
        result.current.fieldActions.registerField('foo');
      });

      const state = result.current.state;

      act(() => {
        result.current.fieldActions.registerField('foo');
      });

      expect(result.current.state).toBe(state);
    });

    it('should keep initial values', async () => {
      const { result, waitFor } = renderHook(() => useForm({
        initialValues: { foo: 'bar' },
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      await waitFor(() => {
        expect(result.current.state.isFormReady).toEqual(true);
      });

      act(() => {
        result.current.fieldActions.registerField('foo');
      });

      expect(result.current.state.fields.values).toEqual({ foo: 'bar' });
    });

    it('should validate the form', async () => {
      const { result, waitFor, waitForNextUpdate } = renderHook(() => {
        return useForm({
          initialValues: { foo: 1 },
          jsonSchema: {
            properties: {
              foo: { type: 'string' }
            },
            type: 'object'
          },
          onSubmit: () => {}
        });
      });

      await waitFor(() => {
        expect(result.current.state.isFormReady).toEqual(true);
      });

      await waitForNextUpdate();

      act(() => {
        result.current.fieldActions.registerField('foo');
      });

      expect(result.current.state.fields.errors).toHaveProperty('foo');
    });
  }, 60000);

  describe('reset', () => {
    it('should clear the form values', async () => {
      const { result, waitFor } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      await waitFor(() => {
        expect(result.current.state.isFormReady).toEqual(true);
      });

      act(() => {
        result.current.fieldActions.setFieldValue('foo', 'bar');
        result.current.formActions.reset();
      });

      expect(result.current.state.fields.values).toEqual({});
    });

    it('should set the initial values', async () => {
      const { result, waitFor } = renderHook(() => useForm({
        initialValues: { foo: 'bar' },
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      await waitFor(() => {
        expect(result.current.state.isFormReady).toEqual(true);
      });

      act(() => {
        result.current.fieldActions.setFieldValue('foo', 'baz');
        result.current.formActions.reset();
      });

      expect(result.current.state.fields.values).toEqual({ foo: 'bar' });
    });

    it('should set the received values as initial values', async () => {
      const { result, waitFor } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      await waitFor(() => {
        expect(result.current.state.isFormReady).toEqual(true);
      });

      act(() => {
        result.current.formActions.reset({
          baz: 'qux',
          foo: 'bar'
        });
      });

      expect(result.current.state.fields.values).toEqual({
        baz: 'qux',
        foo: 'bar'
      });
    });

    it('should clear the form errors', async () => {
      const { result, waitFor } = renderHook(() => useForm({
        jsonSchema: {
          properties: {
            foo: { type: 'string' }
          },
          type: 'object'
        },
        onSubmit: () => {}
      }));

      await waitFor(() => {
        expect(result.current.state.isFormReady).toEqual(true);
      });

      act(() => {
        result.current.fieldActions.setFieldValue('foo', 1);
        result.current.formActions.reset();
      });

      expect(result.current.state.fields.errors).toEqual({});
    });

    it('should set all fields to inactive, untouched and pristine', async () => {
      const { result, waitFor } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      await waitFor(() => {
        expect(result.current.state.isFormReady).toEqual(true);
      });

      act(() => {
        result.current.fieldActions.blurField('foo');
        result.current.fieldActions.setFieldValue('foo', 'bar');
        result.current.fieldActions.focusField('foo');
        result.current.formActions.reset();
      });

      expect(result.current.state.fields.meta).toEqual({
        foo: {
          active: false,
          dirty: false,
          touched: false
        }
      });
    });
  });

  describe('setFieldValue', () => {
    it('should set the field value', async () => {
      const { result, waitFor } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      await waitFor(() => {
        expect(result.current.state.isFormReady).toEqual(true);
      });

      act(() => {
        result.current.fieldActions.setFieldValue('foo', 'bar');
      });

      expect(result.current.state.fields.values).toEqual({ foo: 'bar' });
    });

    it('should set the field to dirty', async () => {
      const { result, waitFor } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      await waitFor(() => {
        expect(result.current.state.isFormReady).toEqual(true);
      });

      act(() => {
        result.current.fieldActions.setFieldValue('foo', 'bar');
      });

      expect(result.current.state.fields.meta.foo).toEqual(expect.objectContaining({
        dirty: true
      }));
    });

    it('should validate the form', async () => {
      const { result, waitFor } = renderHook(() => useForm({
        jsonSchema: {
          properties: {
            foo: { type: 'string' }
          },
          type: 'object'
        },
        onSubmit: () => {}
      }));

      await waitFor(() => {
        expect(result.current.state.isFormReady).toEqual(true);
      });

      act(() => {
        result.current.fieldActions.setFieldValue('foo', 1);
      });

      expect(result.current.state.fields.errors).toHaveProperty('foo');
    });

    it('should call the passed callback with the current field value and update it to the returned value', async () => {
      const callback = jest.fn(() => 'qux');
      const { result, waitFor } = renderHook(() => useForm({
        initialValues: { foo: 'bar' },
        jsonSchema: {
          properties: {
            foo: { type: 'string' }
          },
          type: 'object'
        },
        onSubmit: () => {}
      }));

      await waitFor(() => {
        expect(result.current.state.isFormReady).toEqual(true);
      });

      act(() => {
        result.current.fieldActions.setFieldValue('foo', callback);
      });

      expect(callback).toHaveBeenCalledWith('bar');
      expect(result.current.state.fields.values).toEqual({ foo: 'qux' });
    });
  });

  describe('submit', () => {
    it('should call the `onSubmit` option with the form values and actions', async () => {
      const onSubmit = jest.fn();
      const { result, waitFor, waitForNextUpdate } = renderHook(() => useForm({
        initialValues: { foo: 'bar' },
        jsonSchema: { type: 'object' },
        onSubmit
      }));

      await waitFor(() => {
        expect(result.current.state.isFormReady).toEqual(true);
      });

      act(() => {
        result.current.formActions.submit();
      });

      await waitForNextUpdate();

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith({ foo: 'bar' }, {
        reset: expect.any(Function)
      });
    });

    it('should not call `onSubmit` when the form has errors', async () => {
      const onSubmit = jest.fn();
      const { rerender, result, waitFor } = renderHook(() => useForm({
        initialValues: { foo: 1 },
        jsonSchema: {
          properties: {
            foo: { type: 'string' }
          },
          type: 'object'
        },
        onSubmit
      }));

      await waitFor(() => {
        expect(result.current.state.isFormReady).toEqual(true);
      });

      act(() => {
        result.current.fieldActions.blurField('foo');
        result.current.formActions.submit();
      });

      // Force rerender to ensure effect is called.
      rerender();

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should set the `isSubmitting` flag', async () => {
      expect.assertions(4);

      const onSubmit = jest.fn();
      const { result, waitFor, waitForNextUpdate } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit
      }));

      await waitFor(() => {
        expect(result.current.state.isFormReady).toEqual(true);
      });

      act(() => {
        result.current.formActions.submit();
      });

      expect(result.current.state.isSubmitting).toBe(true);

      await waitForNextUpdate();

      expect(result.current.state.isSubmitting).toBe(false);
    });

    it('should not reset the form values', async () => {
      const onSubmit = jest.fn();
      const { result, waitFor, waitForNextUpdate } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit
      }));

      await waitForNextUpdate();
      await waitFor(() => {
        expect(result.current.state.isFormReady).toEqual(true);
      });

      await waitForNextUpdate();

      act(() => {
        result.current.fieldActions.setFieldValue('foo', 'bar');
        result.current.formActions.submit();
      });

      expect(result.current.state.fields.values).toEqual({ foo: 'bar' });
    });

    it('should set all fields to touched', async () => {
      const { result, waitFor, waitForNextUpdate } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      await waitForNextUpdate();
      await waitFor(() => {
        expect(result.current.state.isFormReady).toEqual(true);
      });

      act(() => {
        result.current.fieldActions.registerField('foo');
        result.current.formActions.submit();
      });

      expect(result.current.state.fields.meta).toEqual({
        foo: expect.objectContaining({
          touched: true
        })
      });
    });

    it('should validate the form', async () => {
      const { result, waitFor, waitForNextUpdate } = renderHook(() => useForm({
        initialValues: { foo: 1 },
        jsonSchema: {
          properties: {
            foo: { type: 'string' }
          },
          type: 'object'
        },
        onSubmit: () => {}
      }));

      await waitFor(() => {
        expect(result.current.state.isFormReady).toEqual(true);
      });

      act(() => {
        result.current.formActions.submit();
      });

      await waitForNextUpdate();

      expect(result.current.state.fields.errors).toHaveProperty('foo');
    }, 60000);

    it('should reset the form if the passed `reset` action is called', async () => {
      const onSubmit = jest.fn((values, { reset }) => {
        reset();

        return Promise.resolve();
      });

      const { result, waitFor, waitForNextUpdate } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit
      }));

      await waitFor(() => {
        expect(result.current.state.isFormReady).toEqual(true);
      });

      act(() => {
        result.current.fieldActions.setFieldValue('foo', 'bar');
        result.current.formActions.submit();
      });

      await waitForNextUpdate();

      expect(result.current.state.fields.values).toEqual({});
    });

    it('should change the foo value when set field value with any value', async () => {
      const stateReducer = (state, action) => {
        const { type } = action;

        switch (type) {
          case actionTypes.SET_FIELD_VALUE:
            return merge({}, state, {
              fields: {
                values: {
                  foo: 'biz'
                }
              }
            });

          default:
            return state;
        }
      };

      const { result, waitFor } = renderHook(() => useForm({
        initialValues: { foo: 1 },
        jsonSchema: {
          properties: {
            bar: { type: 'string' },
            foo: { type: 'string' }
          },
          type: 'object'
        },
        onSubmit: () => {},
        stateReducer
      }));

      await waitFor(() => {
        expect(result.current.state.isFormReady).toEqual(true);
      });

      act(() => {
        result.current.fieldActions.setFieldValue('foo', 'foo');
        result.current.fieldActions.setFieldValue('bar', 'bar');
      });

      expect(result.current.state.fields.values.foo).toEqual('biz');
      expect(result.current.state.fields.values.bar).toEqual('bar');
    });

    it('should validate the field with custom format', async () => {
      const { result, waitFor } = renderHook(() => useForm({
        initialValues: {
          bar: '123',
          foo: '123'
        },
        jsonSchema: {
          properties: {
            bar: {
              format: 'bar',
              type: 'string'
            },
            foo: {
              format: 'foo',
              type: 'string'
            }
          },
          type: 'object'
        },
        onSubmit: () => {},
        validationOptions: {
          formats: {
            bar: value => !isNaN(Number(value)),
            foo: () => false
          }
        }
      }));

      await waitFor(() => {
        expect(result.current.state.isFormReady).toEqual(true);
      });

      act(() => {
        result.current.formActions.submit();
      });

      expect(result.current.state.fields.errors).toEqual({
        foo: {
          args: { format: 'foo' },
          rule: 'format'
        }
      });
    });

    it('should validate with custom keywords', async () => {
      const { result, waitFor } = renderHook(() => useForm({
        initialValues: {
          bar: '123',
          foo: '123'
        },
        jsonSchema: {
          properties: {
            bar: {
              isBar: true,
              type: 'string'
            },
            foo: {
              isFoo: true,
              type: 'string'
            }
          },
          type: 'object'
        },
        onSubmit: () => {},
        validationOptions: {
          keywords: [{
            keyword: 'isBar',
            type: 'string',
            validate: () => true
          }, {
            keyword: 'isFoo',
            type: 'string',
            validate: () => false
          }]
        }
      }));

      await waitFor(() => {
        expect(result.current.state.isFormReady).toEqual(true);
      });

      act(() => {
        result.current.formActions.submit();
      });

      expect(result.current.state.fields.errors).toEqual({
        foo: {
          args: {},
          rule: 'isFoo'
        }
      });
    });
  });

  describe('form meta', () => {
    it('should set the form as active when a field is active', async () => {
      const { result, waitFor } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      await waitFor(() => {
        expect(result.current.state.isFormReady).toEqual(true);
      });

      act(() => {
        result.current.fieldActions.focusField('foo');
      });

      expect(result.current.state.meta.active).toBe(true);
    });

    it('should set the form as dirty when a field is dirty', async () => {
      const { result, waitFor } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      await waitFor(() => {
        expect(result.current.state.isFormReady).toEqual(true);
      });

      act(() => {
        result.current.fieldActions.setFieldValue('foo', 'bar');
      });

      expect(result.current.state.meta.dirty).toBe(true);
    });

    it('should set the form as touched when a field is touched', async () => {
      const { result, waitFor } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      await waitFor(() => {
        expect(result.current.state.isFormReady).toEqual(true);
      });

      act(() => {
        result.current.fieldActions.blurField('foo');
      });

      expect(result.current.state.meta.touched).toBe(true);
    });
  });

  describe('custom validate', () => {
    it('should be called when a field value changes', async () => {
      const validate = jest.fn(() => ({}));
      const jsonSchema = { type: 'object' };
      const { result, waitFor } = renderHook(() => useForm({
        jsonSchema,
        onSubmit: () => {},
        validate,
        validationOptions: 'qux'
      }));

      await waitFor(() => {
        expect(result.current.state.isFormReady).toEqual(true);
      });

      act(() => {
        result.current.fieldActions.setFieldValue('foo', 'bar');
      });

      expect(validate).toHaveBeenCalledWith(jsonSchema, { foo: 'bar' }, 'qux');
    });

    it('should set errors to an empty object when validate returns undefined', async () => {
      const { result, waitFor } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {},
        validate: () => {}
      }));

      await waitFor(() => {
        expect(result.current.state.isFormReady).toEqual(true);
      });

      act(() => {
        result.current.fieldActions.setFieldValue('foo', 'bar');
      });

      expect(result.current.state.fields.errors).toEqual({});
    });
  });
});
