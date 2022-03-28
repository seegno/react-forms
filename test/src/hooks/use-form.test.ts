
/**
 * Module dependencies.
 */

import { act, renderHook } from '@testing-library/react-hooks';
import {
  /* TODO:
  actionTypes,
  */
  useForm
} from 'hooks/use-form';

// TODO: import validate from '../../../src/validate';

/**
 * `useForm` hook tests.
 */

describe('useForm hook', () => {
  it('should set the initial values', () => {
    const { result } = renderHook(() => useForm({
      initialValues: { foo: 'bar' },
      jsonSchema: { type: 'object' },
      onSubmit: () => {}
    }));

    expect(result.current.formState.getValues()).toEqual({
      foo: 'bar'
    });
  });

  it('should start as not active, not dirty, not touched and without errors', () => {
    const { result } = renderHook(() => useForm({
      jsonSchema: { type: 'object' },
      onSubmit: () => {}
    }));

    expect(result.current.formState.getMeta()).toEqual({
      active: false,
      dirty: false,
      hasErrors: false,
      touched: false
    });
  });

  it('should validate the initial values', () => {
    const { result } = renderHook(() => useForm({
      initialValues: {},
      jsonSchema: {
        required: ['foo'],
        type: 'object'
      },
      onSubmit: () => {}
    }));

    expect(result.current.formState.getErrors()).toHaveProperty('foo');
    expect(result.current.formState.getMeta()).toEqual({
      active: false,
      dirty: false,
      hasErrors: true,
      touched: false
    });
  });

  it('should call `onValuesChanged` when the form values change', () => {
    const onValuesChanged = jest.fn();
    const { result } = renderHook(() => useForm({
      initialValues: { foo: 'bar' },
      jsonSchema: { type: 'object' },
      onSubmit: () => {},
      onValuesChanged
    }));

    act(() => {
      result.current.formState.setFieldValue('foo', 'qux');
    });

    expect(onValuesChanged).toHaveBeenCalledWith({ foo: 'qux' });
  });

  /* TODO
  describe('blurField', () => {
    it('should set the field to inactive and touched', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.fieldActions.blurField('foo');
      });

      expect(result.current.state.fields.meta.foo).toEqual({
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
        onSubmit: () => {}
      }));

      act(() => {
        result.current.fieldActions.blurField('foo');
      });

      expect(result.current.state.fields.errors).toHaveProperty('foo');
    });
  });
  */

  /* TODO
  describe('focusField', () => {
    it('should set the field to active', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.fieldActions.focusField('foo');
      });

      expect(result.current.state.fields.meta.foo).toEqual({
        active: true
      });
    });

    it('should not validate the form', () => {
      const mockValidate = jest.fn(validate);
      const { result } = renderHook(() => useForm({
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

      // Reset mock calls, because initialization calls `validate`.
      mockValidate.mockReset();

      act(() => {
        result.current.fieldActions.focusField('foo');
      });

      expect(mockValidate).not.toHaveBeenCalled();
    });
  });
  */

  /* TODO
  describe('registerField', () => {
    it('should register the field', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      expect(result.current.state.fields.values).not.toHaveProperty('foo');
      expect(result.current.state.fields.meta).not.toHaveProperty('foo');

      act(() => {
        result.current.fieldActions.registerField('foo');
      });

      expect(result.current.state.fields.values).toHaveProperty('foo');
      expect(result.current.state.fields.meta).toHaveProperty('foo');
    });

    it('should keep initial values', () => {
      const { result } = renderHook(() => useForm({
        initialValues: { foo: 'bar' },
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.fieldActions.registerField('foo');
      });

      expect(result.current.state.fields.values).toEqual({ foo: 'bar' });
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
        onSubmit: () => {}
      }));

      act(() => {
        result.current.fieldActions.registerField('foo');
      });

      expect(result.current.state.fields.errors).toHaveProperty('foo');
    });
  });
  */

  describe('reset', () => {
    it('should clear the form values', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.formState.setFieldValue('foo', 'bar');
        result.current.formActions.reset();
      });

      expect(result.current.formState.getValues()).toEqual({});
    });

    it('should set the initial values', () => {
      const { result } = renderHook(() => useForm({
        initialValues: { foo: 'bar' },
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.formState.setFieldValue('foo', 'baz');
        result.current.formActions.reset();
      });

      expect(result.current.formState.getValues()).toEqual({ foo: 'bar' });
    });

    it('should set the received values as initial values', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.formActions.reset({
          baz: 'qux',
          foo: 'bar'
        });
      });

      expect(result.current.formState.getValues()).toEqual({
        baz: 'qux',
        foo: 'bar'
      });
    });

    it('should clear the form errors', () => {
      const { result } = renderHook(() => useForm({
        initialValues: { foo: 'bar' },
        jsonSchema: {
          properties: {
            foo: { type: 'string' }
          },
          type: 'object'
        },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.formState.setFieldValue('foo', 1);
      });

      expect(result.current.formState.getErrors()).toEqual({
        foo: expect.objectContaining({
          rule: 'type'
        })
      });

      act(() => {
        result.current.formActions.reset();
      });

      expect(result.current.formState.getErrors()).toEqual({});
    });

    it('should set all fields to inactive, untouched and pristine', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.formState.blurField('foo');
        result.current.formState.setFieldValue('foo', 'bar');
        result.current.formState.focusField('foo');
        result.current.formActions.reset();
      });

      expect(result.current.formState.getFieldsMeta()).toEqual({
        foo: {
          active: false,
          dirty: false,
          touched: false
        }
      });
    });
  });

  /* TODO
  describe('setFieldValue', () => {
    it('should set the field value', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.fieldActions.setFieldValue('foo', 'bar');
      });

      expect(result.current.state.fields.values).toEqual({ foo: 'bar' });
    });

    it('should set the field to dirty', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.fieldActions.setFieldValue('foo', 'bar');
      });

      expect(result.current.state.fields.meta.foo).toEqual(expect.objectContaining({
        dirty: true
      }));
    });

    it('should validate the form', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: {
          properties: {
            foo: { type: 'string' }
          },
          type: 'object'
        },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.fieldActions.setFieldValue('foo', 1);
      });

      expect(result.current.state.fields.errors).toHaveProperty('foo');
    });

    it('should call the passed callback with the current field value and update it to the returned value', () => {
      const callback = jest.fn(() => 'qux');
      const { result } = renderHook(() => useForm({
        initialValues: { foo: 'bar' },
        jsonSchema: {
          properties: {
            foo: { type: 'string' }
          },
          type: 'object'
        },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.fieldActions.setFieldValue('foo', callback);
      });

      expect(callback).toHaveBeenCalledWith('bar');
      expect(result.current.state.fields.values).toEqual({ foo: 'qux' });
    });
  });
  */

  describe('submit', () => {
    it('should call the `onSubmit` option with the form values and actions', () => {
      const onSubmit = jest.fn();
      const { result } = renderHook(() => useForm({
        initialValues: { foo: 'bar' },
        jsonSchema: { type: 'object' },
        onSubmit
      }));

      act(() => {
        result.current.formActions.submit();
      });

      // TODO: await waitForNextUpdate();

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith({ foo: 'bar' }, {
        reset: expect.any(Function)
      });
    });

    it('should not call `onSubmit` when the form has errors', () => {
      const onSubmit = jest.fn();
      const { result } = renderHook(() => useForm({
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
        result.current.formActions.submit();
      });

      // Force rerender to ensure effect is called.
      // rerender();

      expect(onSubmit).not.toHaveBeenCalled();
    });

    /* TODO
    it('should set the `isSubmitting` flag', async () => {
      expect.assertions(2);

      const onSubmit = jest.fn();
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
    */

    it('should not reset the form values', () => {
      const onSubmit = jest.fn();
      const { result } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit
      }));

      act(() => {
        result.current.formState.setFieldValue('foo', 'bar');
        result.current.formActions.submit();
      });

      // TODO: await waitForNextUpdate();

      expect(result.current.formState.getValues()).toEqual({ foo: 'bar' });
    });

    /* TODO
    it('should set all fields to touched', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.fieldActions.registerField('foo');
        result.current.formActions.submit();
      });

      await waitForNextUpdate();

      expect(result.current.state.fields.meta).toEqual({
        foo: expect.objectContaining({
          touched: true
        })
      });
    });
    */

    /* TODO
    it('should validate the form', () => {
      const { result } = renderHook(() => useForm({
        initialValues: { foo: 1 },
        jsonSchema: {
          properties: {
            foo: { type: 'string' }
          },
          type: 'object'
        },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.formActions.submit();
      });

      expect(result.current.state.fields.errors).toHaveProperty('foo');
    });
    */

    it('should reset the form if the passed `reset` action is called', () => {
      const onSubmit = jest.fn((values, { reset }) => {
        reset();

        return Promise.resolve();
      });

      const { result } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit
      }));

      act(() => {
        result.current.formState.setFieldValue('foo', 'bar');
        result.current.formActions.submit();
      });

      // TODO: await waitForNextUpdate();

      expect(result.current.formState.getValues()).toEqual({});
    });

    /* TODO
    it('should change the foo value when set field value with any value', () => {
      const stateReducer = (state, action) => {
        const { type } = action;

        switch (type) {
          case actionTypes.SET_FIELD_VALUE:
            return {
              ...state,
              fields: {
                ...state.fields,
                values: {
                  foo: 'biz'
                }
              }
            };

          default:
            return state;
        }
      };

      const { result } = renderHook(() => useForm({
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

      act(() => {
        result.current.fieldActions.setFieldValue('foo', 'foo');
        result.current.fieldActions.setFieldValue('bar', 'bar');
      });

      expect(result.current.state.fields.values.foo).toEqual('biz');
      expect(result.current.state.fields.values.bar).toEqual('bar');
    });
    */

    /* TODO
    it('should validate the field with custom format', () => {
      const { result } = renderHook(() => useForm({
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

      act(() => {
        result.current.formActions.submit();
      });

      expect(result.current.state.fields.errors).toEqual({
        foo: {
          rule: 'format'
        }
      });
    });
    */

    /* TODO
    it('should validate with custom keywords', () => {
      const { result } = renderHook(() => useForm({
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

      act(() => {
        result.current.formActions.submit();
      });

      expect(result.current.state.fields.errors).toEqual({
        foo: {
          rule: 'isFoo'
        }
      });
    });
    */
  });

  describe('form meta', () => {
    it('should set the form as active when a field is active', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.formState.focusField('foo');
      });

      expect(result.current.formState.getMeta().active).toBe(true);
    });

    it('should set the form as dirty when a field is dirty', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.formState.setFieldValue('foo', 'bar');
      });

      expect(result.current.formState.getMeta().dirty).toBe(true);
    });

    it('should set the form as touched when a field is touched', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.formState.blurField('foo');
      });

      expect(result.current.formState.getMeta().touched).toBe(true);
    });
  });

  /* TODO
  describe.skip('custom validate', () => {
    it('should be called when a field value changes', () => {
      const validate = jest.fn(() => ({}));
      const jsonSchema = { type: 'object' };
      const { result } = renderHook(() => useForm({
        jsonSchema,
        onSubmit: () => {},
        validate,
        validationOptions: 'qux'
      }));

      act(() => {
        result.current.fieldActions.setFieldValue('foo', 'bar');
      });

      expect(validate).toHaveBeenCalledWith(jsonSchema, { foo: 'bar' }, 'qux');
    });

    it('should set errors to an empty object when validate returns undefined', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {},
        validate: () => {}
      }));

      act(() => {
        result.current.fieldActions.setFieldValue('foo', 'bar');
      });

      expect(result.current.state.fields.errors).toEqual({});
    });
  });
  */
});
