
/**
 * Module dependencies.
 */

import validate from 'utils/validate';

/**
 * Validate utility tests.
 */

describe('validate', () => {
  it('should return an empty state when there are no errors', () => {
    const result = validate({ type: 'object' }, {});

    expect(result).toEqual({});
  });

  it('should return errors with the `type` rule when a value does not match the type', () => {
    const result = validate({
      properties: {
        foo: { type: 'string' },
        'foo-bar': { type: 'string' }
      },
      type: 'object'
    }, {
      foo: 1,
      'foo-bar': 1
    });

    expect(result).toEqual({
      foo: {
        rule: 'type'
      },
      'foo-bar': {
        rule: 'type'
      }
    });
  });

  it('should return errors with the `type` rule when a value does not match the type and we have nested objects', () => {
    const result = validate({
      properties: {
        foo: {
          properties: {
            bar: {
              type: 'string'
            }
          },
          type: 'object'
        },
        'foo-baz': { type: 'string' }
      },
      type: 'object'
    }, {
      foo: {
        bar: 1
      },
      'foo-baz': 1
    });

    expect(result).toEqual({
      foo: {
        bar: {
          rule: 'type'
        }
      },
      'foo-baz': {
        rule: 'type'
      }
    });
  });

  it('should return errors with the `required` rule when a property is required', () => {
    const result = validate({
      properties: {
        foo: { type: 'string' }
      },
      required: ['foo'],
      type: 'object'
    }, {});

    expect(result).toEqual({
      foo: {
        rule: 'required'
      }
    });
  });

  it('should return errors with the `required` rule when a property is required and we have nested objects', () => {
    const result = validate({
      properties: {
        foo: {
          properties: {
            bar: {
              type: 'string'
            }
          },
          required: ['bar'],
          type: 'object'
        }
      },
      required: ['foo'],
      type: 'object'
    }, {
      foo: {}
    });

    expect(result).toEqual({
      foo: {
        bar: {
          rule: 'required'
        }
      }
    });
  });

  it('should return errors with the `additionalProperties` rule when a property should not exist', () => {
    const result = validate({
      additionalProperties: false,
      properties: {},
      type: 'object'
    }, {
      foo: 'bar'
    });

    expect(result).toEqual({
      foo: {
        rule: 'additionalProperties'
      }
    });
  });

  it('should return errors with the `additionalProperties` rule when a property should not exist and we have nested objects', () => {
    const result = validate({
      properties: {
        foo: {
          additionalProperties: false,
          properties: {},
          type: 'object'
        }
      },
      type: 'object'
    }, {
      foo: {
        bar: 'baz'
      }
    });

    expect(result).toEqual({
      foo: {
        bar: {
          rule: 'additionalProperties'
        }
      }
    });
  });

  it('should return errors with the `maxLength` rule and `max` argument when a value is too large', () => {
    const result = validate({
      properties: {
        foo: {
          maxLength: 2,
          type: 'string'
        }
      },
      required: ['foo'],
      type: 'object'
    }, {
      foo: 'bar'
    });

    expect(result).toEqual({
      foo: {
        args: { max: 2 },
        rule: 'maxLength'
      }
    });
  });

  it('should return errors with the `maxLength` rule and `max` argument when a nested value is too large', () => {
    const result = validate({
      properties: {
        foo: {
          properties: {
            bar: {
              maxLength: 2,
              type: 'string'
            }
          },
          required: ['bar'],
          type: 'object'
        }
      },
      required: ['foo'],
      type: 'object'
    }, {
      foo: {
        bar: 'baz'
      }
    });

    expect(result).toEqual({
      foo: {
        bar: {
          args: { max: 2 },
          rule: 'maxLength'
        }
      }
    });
  });

  it('should return errors with the `minLength` rule and `min` argument when a value is too small', () => {
    const result = validate({
      properties: {
        foo: {
          minLength: 4,
          type: 'string'
        }
      },
      required: ['foo'],
      type: 'object'
    }, {
      foo: 'bar'
    });

    expect(result).toEqual({
      foo: {
        args: { min: 4 },
        rule: 'minLength'
      }
    });
  });

  it('should return errors with the `minLength` rule and `min` argument when a nested value is too small', () => {
    const result = validate({
      properties: {
        foo: {
          properties: {
            bar: {
              minLength: 4,
              type: 'string'
            }
          },
          required: ['bar'],
          type: 'object'
        }
      },
      required: ['foo'],
      type: 'object'
    }, {
      foo: {
        bar: 'baz'
      }
    });

    expect(result).toEqual({
      foo: {
        bar: {
          args: { min: 4 },
          rule: 'minLength'
        }
      }
    });
  });

  it('should return errors with the `maxItems` rule and `max` argument when there are too many items', () => {
    const result = validate({
      properties: {
        foo: {
          maxItems: 1,
          type: 'array'
        }
      }
    }, {
      foo: [1, 2]
    });

    expect(result).toEqual({
      foo: {
        args: { max: 1 },
        rule: 'maxItems'
      }
    });
  });

  it('should return errors with the `maxItems` rule and `max` argument when there are too many items and we have nested objects', () => {
    const result = validate({
      properties: {
        foo: {
          properties: {
            bar: {
              maxItems: 1,
              type: 'array'
            }
          },
          type: 'object'
        }
      }
    }, {
      foo: {
        bar: [1, 2]
      }
    });

    expect(result).toEqual({
      foo: {
        bar: {
          args: { max: 1 },
          rule: 'maxItems'
        }
      }
    });
  });

  it('should return errors with the `minItems` rule and `min` argument when there are not enough items', () => {
    const result = validate({
      properties: {
        foo: {
          minItems: 2,
          type: 'array'
        }
      }
    }, {
      foo: [1]
    });

    expect(result).toEqual({
      foo: {
        args: { min: 2 },
        rule: 'minItems'
      }
    });
  });

  it('should return errors with the `minItems` rule and `min` argument when there are not enough items and we have nested objects', () => {
    const result = validate({
      properties: {
        foo: {
          properties: {
            bar: {
              minItems: 2,
              type: 'array'
            }
          },
          type: 'object'
        }
      }
    }, {
      foo: {
        bar: [1]
      }
    });

    expect(result).toEqual({
      foo: {
        bar: {
          args: { min: 2 },
          rule: 'minItems'
        }
      }
    });
  });

  it('should return errors with the `maxProperties` rule and `max` argument when there are too many properties', () => {
    const result = validate({
      properties: {
        foo: {
          maxProperties: 1,
          type: 'object'
        }
      }
    }, {
      foo: {
        bar: 'qux',
        baz: 'biz'
      }
    });

    expect(result).toEqual({
      foo: {
        args: { max: 1 },
        rule: 'maxProperties'
      }
    });
  });

  it('should return errors with the `maxProperties` rule and `max` argument when there are too many properties and we have nested objects', () => {
    const result = validate({
      properties: {
        foo: {
          properties: {
            quux: {
              maxProperties: 1,
              type: 'object'
            }
          }
        }
      }
    }, {
      foo: {
        quux: {
          bar: 'qux',
          baz: 'biz'
        }
      }
    });

    expect(result).toEqual({
      foo: {
        quux: {
          args: { max: 1 },
          rule: 'maxProperties'
        }
      }
    });
  });

  it('should return errors with the `minProperties` rule and `min` argument when there are not enough properties', () => {
    const result = validate({
      properties: {
        foo: {
          minProperties: 2,
          type: 'string'
        }
      }
    }, {
      foo: {
        bar: 'qux'
      }
    });

    expect(result).toEqual({
      foo: {
        args: { min: 2 },
        rule: 'minProperties'
      }
    });
  });

  it('should return errors with the `minProperties` rule and `min` argument when there are not enough properties and we have nested objects', () => {
    const result = validate({
      properties: {
        foo: {
          properties: {
            baz: {
              minProperties: 2,
              type: 'string'
            }
          }
        }
      }
    }, {
      foo: {
        baz: {
          bar: 'qux'
        }
      }
    });

    expect(result).toEqual({
      foo: {
        baz: {
          args: { min: 2 },
          rule: 'minProperties'
        }
      }
    });
  });

  it('should return errors with the `maximum` rule and `max` argument when the value is too big', () => {
    const result = validate({
      properties: {
        foo: {
          maximum: 1,
          type: 'number'
        }
      }
    }, {
      foo: 2
    });

    expect(result).toEqual({
      foo: {
        args: { max: 1 },
        rule: 'maximum'
      }
    });
  });

  it('should return errors with the `maximum` rule and `max` argument when the nested value is too big', () => {
    const result = validate({
      properties: {
        foo: {
          properties: {
            bar: {
              maximum: 1,
              type: 'number'
            }
          }
        }
      }
    }, {
      foo: {
        bar: 2
      }
    });

    expect(result).toEqual({
      foo: {
        bar: {
          args: { max: 1 },
          rule: 'maximum'
        }
      }
    });
  });

  it('should return errors with the `minimum` rule and `min` argument when the value is too small', () => {
    const result = validate({
      properties: {
        foo: {
          minimum: 2,
          type: 'number'
        }
      }
    }, {
      foo: 1
    });

    expect(result).toEqual({
      foo: {
        args: { min: 2 },
        rule: 'minimum'
      }
    });
  });

  it('should return errors with the `minimum` rule and `min` argument when the nested value is too small', () => {
    const result = validate({
      properties: {
        foo: {
          properties: {
            bar: {
              minimum: 2,
              type: 'number'
            }
          }
        }
      }
    }, {
      foo: {
        bar: 1
      }
    });

    expect(result).toEqual({
      foo: {
        bar: {
          args: { min: 2 },
          rule: 'minimum'
        }
      }
    });
  });

  it('should validate with custom format', () => {
    const result = validate({
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
    }, {
      bar: '123',
      foo: '123'
    }, {
      formats: {
        bar: () => true,
        foo: () => false
      }
    });

    expect(result).toEqual({
      foo: {
        rule: 'format'
      }
    });
  });

  it('should validate with custom format and nested objects', () => {
    const result = validate({
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
    }, {
      bar: {
        baz: '123'
      },
      foo: {
        qux: '123'
      }
    }, {
      formats: {
        baz: () => true,
        qux: () => false
      }
    });

    expect(result).toEqual({
      foo: {
        qux: {
          rule: 'format'
        }
      }
    });
  });

  it('should validate with custom keywords', () => {
    const result = validate({
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
    }, {
      bar: '123',
      foo: '123'
    }, {
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
    });

    expect(result).toEqual({
      foo: {
        rule: 'isFoo'
      }
    });
  });

  it('should validate with custom keywords and nested objects', () => {
    const result = validate({
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
    }, {
      bar: {
        baz: '123'
      },
      foo: {
        qux: '123'
      }
    }, {
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
    });

    expect(result).toEqual({
      foo: {
        qux: {
          rule: 'isQux'
        }
      }
    });
  });
});
