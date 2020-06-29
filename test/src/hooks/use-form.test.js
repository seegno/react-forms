
/**
 * Module dependencies.
 */

import { act, renderHook } from '@testing-library/react-hooks';
import { merge } from 'lodash';
import useForm, { actionTypes } from 'hooks/use-form';

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

    expect(result.current.state.fields.values).toEqual({
      foo: 'bar'
    });
  });

  it('should set the initial values of nested objects', () => {
    const { result } = renderHook(() => useForm({
      initialValues: {
        foo: {
          bar: 'baz'
        }
      },
      jsonSchema: { type: 'object' },
      onSubmit: () => {}
    }));

    expect(result.current.state.fields.values).toEqual({
      foo: {
        bar: 'baz'
      }
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

  it('should call `onValuesChanged` when the form values change and we have nested objects', () => {
    const onValuesChanged = jest.fn();
    const { result } = renderHook(() => useForm({
      jsonSchema: { type: 'object' },
      onSubmit: () => {},
      onValuesChanged
    }));

    act(() => {
      result.current.fieldActions.setFieldValue('foo.bar', 'baz');
    });

    expect(onValuesChanged).toHaveBeenCalledWith({
      foo: {
        bar: 'baz'
      }
    });
  });

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

    it('should set the nested field to inactive and touched', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.fieldActions.blurField('foo.bar');
      });

      expect(result.current.state.fields.meta.foo.bar).toEqual({
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

    it('should validate the nested field value', () => {
      const { result } = renderHook(() => useForm({
        initialValues: {
          foo: {
            bar: 1
          }
        },
        jsonSchema: {
          properties: {
            foo: {
              properties: {
                bar: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          },
          type: 'object'
        },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.fieldActions.blurField('foo.bar');
      });

      expect(result.current.state.fields.errors).toHaveProperty('foo.bar');
    });
  });

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

    it('should set the nested field to active', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.fieldActions.focusField('foo.bar');
      });

      expect(result.current.state.fields.meta.foo.bar).toEqual({
        active: true
      });
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
        onSubmit: () => {}
      }));

      act(() => {
        result.current.fieldActions.focusField('foo');
      });

      expect(result.current.state.fields.errors).toEqual({});
    });

    it('should not validate the form if we have nested objects', () => {
      const { result } = renderHook(() => useForm({
        initialValues: {
          foo: {
            bar: 1
          }
        },
        jsonSchema: {
          properties: {
            foo: {
              properties: {
                bar: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          },
          type: 'object'
        },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.fieldActions.focusField('foo.bar');
      });

      expect(result.current.state.fields.errors).toEqual({});
    });
  });

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

    it('should register the nested field', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      expect(result.current.state.fields.values).not.toHaveProperty('foo.bar');
      expect(result.current.state.fields.meta).not.toHaveProperty('foo.bar');

      act(() => {
        result.current.fieldActions.registerField('foo.bar');
      });

      expect(result.current.state.fields.values).toHaveProperty('foo.bar');
      expect(result.current.state.fields.meta).toHaveProperty('foo.bar');
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

    it('should keep initial values if we have nested objects', () => {
      const { result } = renderHook(() => useForm({
        initialValues: {
          foo: {
            bar: 'baz'
          }
        },
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.fieldActions.registerField('foo.bar');
      });

      expect(result.current.state.fields.values).toEqual({
        foo: {
          bar: 'baz'
        }
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
        onSubmit: () => {}
      }));

      act(() => {
        result.current.fieldActions.registerField('foo');
      });

      expect(result.current.state.fields.errors).toHaveProperty('foo');
    });

    it('should validate the form if we have nested objects', () => {
      const { result } = renderHook(() => useForm({
        initialValues: {
          foo: {
            bar: 1
          }
        },
        jsonSchema: {
          properties: {
            foo: {
              properties: {
                bar: {
                  type: 'string'
                }
              }
            }
          },
          type: 'object'
        },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.fieldActions.registerField('foo.bar');
      });

      expect(result.current.state.fields.errors).toHaveProperty('foo.bar');
    });
  });

  describe('reset', () => {
    it('should clear the form values', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.fieldActions.setFieldValue('foo', 'bar');
      });

      act(() => {
        result.current.formActions.reset();
      });

      expect(result.current.state.fields.values).toEqual({});
    });

    it('should clear the form values if we have nested objects', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.fieldActions.setFieldValue('foo.bar', 'baz');
      });

      act(() => {
        result.current.formActions.reset();
      });

      expect(result.current.state.fields.values).toEqual({});
    });

    it('should set the initial values', () => {
      const { result } = renderHook(() => useForm({
        initialValues: { foo: 'bar' },
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.fieldActions.setFieldValue('foo', 'bar');
        result.current.formActions.reset();
      });

      expect(result.current.state.fields.values).toEqual({ foo: 'bar' });
    });

    it('should set the initial values if we have nested objects', () => {
      const { result } = renderHook(() => useForm({
        initialValues: {
          foo: {
            bar: 'baz'
          }
        },
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.fieldActions.setFieldValue('foo.bar', 'baz');
        result.current.formActions.reset();
      });

      expect(result.current.state.fields.values).toEqual({
        foo: {
          bar: 'baz'
        }
      });
    });

    it('should clear the form errors', () => {
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
        result.current.formActions.reset();
      });

      expect(result.current.state.fields.errors).toEqual({});
    });

    it('should clear the form errors if we have nested objects', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: {
          properties: {
            foo: {
              properties: {
                bar: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          },
          type: 'object'
        },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.fieldActions.setFieldValue('foo.bar', 1);
        result.current.formActions.reset();
      });

      expect(result.current.state.fields.errors).toEqual({});
    });

    it('should set all fields to inactive, untouched and pristine', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

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

    it('should set all nested fields to inactive, untouched and pristine', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.fieldActions.blurField('foo.bar');
        result.current.fieldActions.setFieldValue('foo.bar', 'baz');
        result.current.fieldActions.focusField('foo.bar');
        result.current.formActions.reset();
      });

      expect(result.current.state.fields.meta).toEqual({
        foo: {
          bar: {
            active: false,
            dirty: false,
            touched: false
          }
        }
      });
    });
  });

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

    it('should set the nested field value', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.fieldActions.setFieldValue('foo.bar', 'baz');
      });

      expect(result.current.state.fields.values).toEqual({
        foo: {
          bar: 'baz'
        }
      });
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

    it('should set the nested field to dirty', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.fieldActions.setFieldValue('foo.bar', 'baz');
      });

      expect(result.current.state.fields.meta.foo.bar).toEqual(expect.objectContaining({
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

    it('should validate the form if we have nested objects', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: {
          properties: {
            foo: {
              properties: {
                bar: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          },
          type: 'object'
        },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.fieldActions.setFieldValue('foo.bar', 1);
      });

      expect(result.current.state.fields.errors).toHaveProperty('foo.bar');
    });
  });

  describe('submit', () => {
    it('should call the `onSubmit` option with the form values and actions', async () => {
      const onSubmit = jest.fn();
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

    it('should call the `onSubmit` option with the form values and actions if we have nested objects', async () => {
      const onSubmit = jest.fn();
      const { result, waitForNextUpdate } = renderHook(() => useForm({
        initialValues: {
          foo: {
            bar: 'baz'
          }
        },
        jsonSchema: { type: 'object' },
        onSubmit
      }));

      act(() => {
        result.current.formActions.submit();
      });

      await waitForNextUpdate();

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith({
        foo: {
          bar: 'baz'
        }
      }, {
        reset: expect.any(Function)
      });
    });

    it('should not call `onSubmit` when the form has errors', () => {
      const onSubmit = jest.fn();
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

    it('should not call `onSubmit` when the form has errors and we have nested objects', () => {
      const onSubmit = jest.fn();
      const { rerender, result } = renderHook(() => useForm({
        initialValues: {
          foo: {
            bar: 1
          }
        },
        jsonSchema: {
          properties: {
            foo: {
              properties: {
                bar: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          },
          type: 'object'
        },
        onSubmit
      }));

      act(() => {
        result.current.fieldActions.blurField('foo.bar');
        result.current.formActions.submit();
      });

      // Force rerender to ensure effect is called.
      rerender();

      expect(onSubmit).not.toHaveBeenCalled();
    });

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

    it('should not reset the form values', async () => {
      const onSubmit = jest.fn();
      const { result, waitForNextUpdate } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit
      }));

      act(() => {
        result.current.fieldActions.setFieldValue('foo', 'bar');
        result.current.formActions.submit();
      });

      await waitForNextUpdate();

      expect(result.current.state.fields.values).toEqual({ foo: 'bar' });
    });

    it('should not reset the form values if we have nested objects', async () => {
      const onSubmit = jest.fn();
      const { result, waitForNextUpdate } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit
      }));

      act(() => {
        result.current.fieldActions.setFieldValue('foo.bar', 'baz');
        result.current.formActions.submit();
      });

      await waitForNextUpdate();

      expect(result.current.state.fields.values).toEqual({
        foo: {
          bar: 'baz'
        }
      });
    });

    it('should set all fields to touched', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.fieldActions.registerField('foo');
        result.current.formActions.submit('foo');
      });

      await waitForNextUpdate();

      expect(result.current.state.fields.meta).toEqual({
        foo: expect.objectContaining({
          touched: true
        })
      });
    });

    it('should set all nested fields to touched', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.fieldActions.registerField('foo.bar');
        result.current.formActions.submit();
      });

      await waitForNextUpdate();

      expect(result.current.state.fields.meta).toEqual({
        foo: {
          bar: expect.objectContaining({
            touched: true
          })
        }
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
        onSubmit: () => {}
      }));

      act(() => {
        result.current.formActions.submit();
      });

      expect(result.current.state.fields.errors).toHaveProperty('foo');
    });

    it('should validate the form if we have nested objects', () => {
      const { result } = renderHook(() => useForm({
        initialValues: {
          foo: {
            bar: 1
          }
        },
        jsonSchema: {
          properties: {
            foo: {
              properties: {
                bar: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          },
          type: 'object'
        },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.formActions.submit();
      });

      expect(result.current.state.fields.errors).toHaveProperty('foo.bar');
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

      expect(result.current.state.fields.values).toEqual({});
    });

    it('should reset the form if the passed `reset` action is called and if we have nested objects', async () => {
      const onSubmit = jest.fn((values, { reset }) => {
        reset();

        return Promise.resolve();
      });

      const { result, waitForNextUpdate } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit
      }));

      act(() => {
        result.current.fieldActions.setFieldValue('foo.bar', 'baz');
        result.current.formActions.submit();
      });

      await waitForNextUpdate();

      expect(result.current.state.fields.values).toEqual({});
    });

    it('should change the foo value when set field value with any value', () => {
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

    it('should change the foo.bar value when set field value with any value', () => {
      const stateReducer = (state, action) => {
        const { type } = action;

        switch (type) {
          case actionTypes.SET_FIELD_VALUE:
            return merge({}, state, {
              fields: {
                values: {
                  foo: {
                    bar: 'baz'
                  }
                }
              }
            });

          default:
            return state;
        }
      };

      const { result } = renderHook(() => useForm({
        initialValues: {
          foo: {
            bar: 1
          }
        },
        jsonSchema: {
          properties: {
            foo: {
              properties: {
                bar: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            qux: {
              properties: {
                quux: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          },
          type: 'object'
        },
        onSubmit: () => {},
        stateReducer
      }));

      act(() => {
        result.current.fieldActions.setFieldValue('foo.bar', 'foo.bar');
        result.current.fieldActions.setFieldValue('qux.quux', 'qux.quux');
      });

      expect(result.current.state.fields.values.foo.bar).toEqual('baz');
      expect(result.current.state.fields.values.qux.quux).toEqual('qux.quux');
    });

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

    it('should validate the nested field with custom format', () => {
      const { result } = renderHook(() => useForm({
        initialValues: {
          bar: {
            baz: '123'
          },
          foo: {
            qux: '123'
          }
        },
        jsonSchema: {
          properties: {
            bar: {
              properties: {
                baz: {
                  format: 'baz',
                  type: 'string'
                }
              },
              type: 'object'
            },
            foo: {
              properties: {
                qux: {
                  format: 'qux',
                  type: 'string'
                }
              },
              type: 'object'
            }
          },
          type: 'object'
        },
        onSubmit: () => {},
        validationOptions: {
          formats: {
            baz: value => !isNaN(Number(value)),
            qux: () => false
          }
        }
      }));

      act(() => {
        result.current.formActions.submit();
      });

      expect(result.current.state.fields.errors).toEqual({
        foo: {
          qux: {
            rule: 'format'
          }
        }
      });
    });

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
          keywords: {
            isBar: {
              type: 'string',
              validate: () => true
            },
            isFoo: {
              type: 'string',
              validate: () => false
            }
          }
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

    it('should validate with custom keywords if we have nested objects', () => {
      const { result } = renderHook(() => useForm({
        initialValues: {
          bar: {
            baz: '123'
          },
          foo: {
            qux: '123'
          }
        },
        jsonSchema: {
          properties: {
            bar: {
              properties: {
                baz: {
                  isBaz: true,
                  type: 'string'
                }
              },
              type: 'object'
            },
            foo: {
              properties: {
                qux: {
                  isQux: true,
                  type: 'string'
                }
              },
              type: 'object'
            }
          },
          type: 'object'
        },
        onSubmit: () => {},
        validationOptions: {
          keywords: {
            isBaz: {
              type: 'string',
              validate: () => true
            },
            isQux: {
              type: 'string',
              validate: () => false
            }
          }
        }
      }));

      act(() => {
        result.current.formActions.submit();
      });

      expect(result.current.state.fields.errors).toEqual({
        foo: {
          qux: {
            rule: 'isQux'
          }
        }
      });
    });
  });

  describe('form meta', () => {
    it('should set the form as active when a field is active', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.fieldActions.focusField('foo');
      });

      expect(result.current.state.meta.active).toBe(true);
    });

    it('should set the form as active when a nested field is active', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.fieldActions.focusField('foo.bar');
      });

      expect(result.current.state.meta.active).toBe(true);
    });

    it('should set the form as dirty when a field is dirty', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.fieldActions.setFieldValue('foo', 'bar');
      });

      expect(result.current.state.meta.dirty).toBe(true);
    });

    it('should set the form as dirty when a nested field is dirty', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.fieldActions.setFieldValue('foo.bar', 'baz');
      });

      expect(result.current.state.meta.dirty).toBe(true);
    });

    it('should set the form as touched when a field is touched', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.fieldActions.blurField('foo');
      });

      expect(result.current.state.meta.touched).toBe(true);
    });

    it('should set the form as touched when a nested field is touched', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {}
      }));

      act(() => {
        result.current.fieldActions.blurField('foo.bar');
      });

      expect(result.current.state.meta.touched).toBe(true);
    });
  });

  describe('custom validate', () => {
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

    it('should be called when a nested field value changes', () => {
      const validate = jest.fn(() => ({}));
      const jsonSchema = { type: 'object' };
      const { result } = renderHook(() => useForm({
        jsonSchema,
        onSubmit: () => {},
        validate,
        validationOptions: 'qux'
      }));

      act(() => {
        result.current.fieldActions.setFieldValue('foo.bar', 'baz');
      });

      expect(validate).toHaveBeenCalledWith(jsonSchema, {
        foo: {
          bar: 'baz'
        }
      }, 'qux');
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

    it('should set errors to an empty object when validate returns undefined and we have nested objects', () => {
      const { result } = renderHook(() => useForm({
        jsonSchema: { type: 'object' },
        onSubmit: () => {},
        validate: () => {}
      }));

      act(() => {
        result.current.fieldActions.setFieldValue('foo.bar', 'baz');
      });

      expect(result.current.state.fields.errors).toEqual({});
    });
  });
});
