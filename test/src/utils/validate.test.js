
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
        foo: { type: 'string' }
      },
      type: 'object'
    }, {
      foo: 1
    });

    expect(result).toEqual({
      foo: {
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
});
