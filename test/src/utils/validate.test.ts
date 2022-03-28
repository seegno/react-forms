
/**
 * Module dependencies.
 */

import { validate } from 'utils/validate';

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

  it('should return errors with the `maxItems` rule and `max` argument when there are too many items', () => {
    const result = validate({
      properties: {
        foo: {
          maxItems: 1,
          type: 'array'
        }
      },
      type: 'object'
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

  it('should return errors with the `minItems` rule and `min` argument when there are not enough items', () => {
    const result = validate({
      properties: {
        foo: {
          minItems: 2,
          type: 'array'
        }
      },
      type: 'object'
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

  it('should return errors with the `maxProperties` rule and `max` argument when there are too many properties', () => {
    const result = validate({
      properties: {
        foo: {
          maxProperties: 1,
          type: 'object'
        }
      },
      type: 'object'
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

  it('should return errors with the `minProperties` rule and `min` argument when there are not enough properties', () => {
    const result = validate({
      properties: {
        foo: {
          minProperties: 2,
          type: 'object'
        }
      },
      type: 'object'
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

  it('should return errors with the `maximum` rule and `max` argument when the value is too big', () => {
    const result = validate({
      properties: {
        foo: {
          maximum: 1,
          type: 'number'
        }
      },
      type: 'object'
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

  it('should return errors with the `minimum` rule and `min` argument when the value is too small', () => {
    const result = validate({
      properties: {
        foo: {
          minimum: 2,
          type: 'number'
        }
      },
      type: 'object'
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

  it('should validate nested properties', () => {
    const result = validate({
      properties: {
        foo: {
          properties: {
            bar: {
              properties: {
                qux: { type: 'string' }
              },
              type: 'object'
            }
          },
          type: 'object'
        }
      },
      type: 'object'
    }, {
      foo: {
        bar: { qux: 1 }
      }
    });

    expect(result).toEqual({
      'foo.bar.qux': {
        rule: 'type'
      }
    });
  });

  it('should validate arrays', () => {
    const result = validate({
      properties: {
        foo: {
          items: {
            properties: {
              bar: {
                items: { type: 'string' },
                type: 'array'
              }
            },
            type: 'object'
          },
          type: 'array'
        }
      },
      type: 'object'
    }, {
      foo: [{
        bar: [1]
      }]
    });

    expect(result).toEqual({
      'foo[0].bar[0]': {
        rule: 'type'
      }
    });
  });

  it('should validate arrays with arrays', () => {
    const result = validate({
      properties: {
        foo: {
          items: {
            items: { type: 'string' },
            type: 'array'
          },
          type: 'array'
        }
      },
      type: 'object'
    }, {
      foo: [[1]]
    });

    expect(result).toEqual({
      'foo[0][0]': {
        rule: 'type'
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
      keywords: [{
        keyword: 'isBar',
        type: 'string',
        validate: () => true
      }, {
        keyword: 'isFoo',
        type: 'string',
        validate: () => false
      }]
    });

    expect(result).toEqual({
      foo: {
        rule: 'isFoo'
      }
    });
  });
});
