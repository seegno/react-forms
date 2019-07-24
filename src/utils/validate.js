// @flow

/**
 * Module dependencies.
 */

import Ajv from 'ajv';

/**
 * Export `FieldErrorType` type.
 */

export type FieldErrorType = {|
  args?: Object,
  rule: string
|};

/**
 * Get property name.
 */

function getPropertyName(error: Object): string {
  const key = error.dataPath.substring(1);

  switch (error.keyword) {
    case 'required':
      return `${key ? `${key}.` : ''}${error.params.missingProperty}`;

    case 'additionalProperties':
      return `${key ? `${key}.` : ''}${error.params.additionalProperty}`;

    default:
      return key;
  }
}

/**
 * Get error args.
 */

function getErrorArgs(error) {
  switch (error.keyword) {
    case 'maxLength':
      return { max: error.params.limit };

    case 'minLength':
      return { min: error.params.limit };

    default:
      return;
  }
}

/**
 * Get error.
 */

const getError = (error): FieldErrorType => ({
  args: getErrorArgs(error),
  rule: error.keyword
});

/**
 * Parse validation errors.
 */

function parseValidationErrors(validationErrors) {
  return validationErrors.reduce((errors, error) => ({
    ...errors,
    [getPropertyName(error)]: getError(error)
  }), {});
}

/**
 * Export `validate`.
 */

export default function validate(schema: Object, values: Object) {
  const ajv = new Ajv({ allErrors: true });

  if (ajv.validate(schema, values)) {
    return {};
  }

  return parseValidationErrors(ajv.errors);
}
