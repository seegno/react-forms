/**
 * Module dependencies.
 */

import { merge } from 'lodash';
import Ajv, {
  AdditionalPropertiesParams,
  ErrorObject,
  LimitParams,
  Options,
  RequiredParams
} from 'ajv';

/**
 * Export `ValidationOptions` type.
 */

export interface ValidationOptions extends Options {
  keywords?: object
};

/**
 * Export `FieldError` type.
 */

export type FieldError = {
  args?: object,
  rule: string
};

/**
 * Export `FieldErrors` type.
 */

export type FieldErrors = {
  [fieldName: string]: FieldError
};

/**
 * Export `getErrorPath`.
 */

export function getErrorPath(error: ErrorObject): string {
  let key;

  // TODO: Handle nested properties.
  if (error.dataPath.startsWith('.')) {
    key = error.dataPath.substring(1);
  } else {
    key = error.dataPath.substring(2, error.dataPath.length - 2);
  }

  switch (error.keyword) {
    case 'required':
      return `${key ? `${key}.` : ''}${(error.params as RequiredParams).missingProperty}`;

    case 'additionalProperties':
      return `${key ? `${key}.` : ''}${(error.params as AdditionalPropertiesParams).additionalProperty}`;

    default:
      return key;
  }
}

/**
 * Get error args.
 */

function getErrorArgs(error: ErrorObject) {
  const { params } = error;

  switch (error.keyword) {
    case 'maxItems':
    case 'maxLength':
    case 'maxProperties':
    case 'maximum':
      return { max: (params as LimitParams).limit };

    case 'minItems':
    case 'minLength':
    case 'minProperties':
    case 'minimum':
      return { min: (params as LimitParams).limit };

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
 * `Validate` type.
 */

export type Validate = (schema: object, values: object, options?: ValidationOptions) => FieldErrors;

/**
 * Export `validate`.
 */

export default function validate(schema: object, values: object, options?: ValidationOptions): FieldErrors {
  const { keywords, ...restOptions } = options ?? {};
  const ajv = new Ajv(merge({}, restOptions, { $data: true, allErrors: true }));

  // TODO: Remove this when ajv adds support for passing keywords in the contructor.
  // https://github.com/epoberezkin/ajv/issues/1136
  if (keywords) {
    for (const [keyword, config] of Object.entries(keywords)) {
      ajv.addKeyword(keyword, config);
    }
  }

  if (ajv.validate(schema, values)) {
    return {};
  }

  return parseValidationErrors(ajv.errors);
}
