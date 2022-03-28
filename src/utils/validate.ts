
/**
 * Module dependencies.
 */

import Ajv, { ErrorObject, Options, Schema } from 'ajv';

/**
 * Export `ValidationOptions` type.
 */

export type ValidationOptions = Options;

/**
 * Export `FieldError` type.
 */

export type FieldError = {
  args?: Record<string, unknown>;
  rule: string;
};

/**
 * Export `FieldErrors` type.
 */

export type FieldErrors = {
  [fieldName: string]: FieldError;
};

/**
 * Export `Validate` type.
 */

export type Validate = (
  schema: Schema,
  values: Record<string, unknown>,
  options?: Options
) => FieldErrors;

/**
 * Export `getErrorPath`.
 */

export function getErrorPath(error: ErrorObject): string {
  let key: string;

  // TODO: Handle nested properties.
  if (error.instancePath.startsWith('/')) {
    key = error.instancePath.substring(1);
  } else {
    key = error.instancePath.substring(2, error.instancePath.length - 2);
  }

  key = key
    .replace(/\/(\d+)(?=\/|$)/g, '[$1]')
    .replace(/\//g, '.');

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

function getErrorArgs(error: ErrorObject) {
  switch (error.keyword) {
    case 'maxItems':
    case 'maxLength':
    case 'maxProperties':
    case 'maximum':
      return { max: error.params.limit };

    case 'minItems':
    case 'minLength':
    case 'minProperties':
    case 'minimum':
      return { min: error.params.limit };

    default:
      return;
  }
}

/**
 * Get error.
 */

const getError = (error: ErrorObject): FieldError => ({
  args: getErrorArgs(error),
  rule: error.keyword
});

/**
 * Parse validation errors.
 */

export function parseValidationErrors(validationErrors: Array<ErrorObject>): FieldErrors {
  return validationErrors.reduce((errors, error) => ({
    ...errors,
    [getErrorPath(error)]: getError(error)
  }), {});
}

/**
 * Export `validate`.
 */

export function validate(schema: Schema, values: Record<string, unknown>, options: Options = {}): FieldErrors {
  const ajv = new Ajv({
    ...options,
    $data: true,
    allErrors: true
  });

  if (ajv.validate(schema, values)) {
    return {};
  }

  return parseValidationErrors(ajv.errors as Array<ErrorObject>);
}
