// @flow

/**
 * Module dependencies.
 */

import { merge, set } from 'lodash';
import Ajv from 'ajv';

/**
 * Export `ValidationOptions` type.
 */

export type ValidationOptions = {
  coerceTypes?: boolean | 'array',
  format?: boolean | 'fast' | 'full',
  formats?: Object,
  keywords?: Object,
  logger?: Function,
  nullable?: boolean,
  removeAdditional?: boolean | 'all' | 'failing',
  schemaId?: String,
  uniqueItems?: boolean,
  unknownFormats?: boolean | Array<string> | 'ignore' | Object,
  useDefaults?: boolean | 'empty' | 'shared'
};

/**
 * `ValidationError` type.
 */

type ValidationError = {|
  dataPath: string,
  keyword: string,
  params: Object
|};

/**
 * Export `FieldError` type.
 */

export type FieldError = {|
  args?: Object,
  rule: string
|};

/**
 * Export `FieldErrors` type.
 */

export type FieldErrors = {
  [fieldName: string]: FieldError
};

/**
 * Export `getErrorPath`.
 */

export function getErrorPath(error: ValidationError): string {
  let key;

  // TODO: Handle nested properties.
  if (error.dataPath.startsWith('.')) {
    key = error.dataPath.substring(1);
  } else {
    key = error.dataPath.substring(2, error.dataPath.length - 2);
  }

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

function getErrorArgs(error: ValidationError) {
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

const getError = (error: ValidationError): FieldError => ({
  args: getErrorArgs(error),
  rule: error.keyword
});

/**
 * Parse validation errors.
 */

export function parseValidationErrors(validationErrors: Array<ValidationError>): FieldErrors {
  return validationErrors.reduce((errors, error) => {
    return {
      ...errors,
      ...set({}, getErrorPath(error), getError(error))
    };
  }, {});
}

/**
 * `Validate` type.
 */

export type Validate = (schema: Object, values: Object, options?: ValidationOptions) => FieldErrors;

/**
 * Export `validate`.
 */

export default function validate(schema: Object, values: Object, options?: ValidationOptions): FieldErrors {
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
