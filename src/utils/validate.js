// @flow

/**
 * Module dependencies.
 */

import { merge } from 'lodash';
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

export default function validate(schema: Object, values: Object, validateOptions?: ValidationOptions) {
  const { keywords, ...restOptions } = validateOptions ?? {};
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
