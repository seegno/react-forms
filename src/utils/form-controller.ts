
/**
 * Module dependencies.
 */

import {
  FieldError,
  FieldErrors
} from './validate';

/**
 * Export `FieldMeta` type.
 */

export type FieldMeta = {
  active: boolean;
  dirty: boolean;
  touched: boolean;
};

/**
 * Export `SubmitStatus` enum.
 */

export enum SubmitStatus {
  Idle = 'idle',
  Submitting = 'submitting'
}

/**
 * Initial field meta.
 */

const initialFieldMeta: FieldMeta = {
  active: false,
  dirty: false,
  touched: false
};

/**
 * `FormStateOptions` type.
 */

type FormStateOptions = {
  getValidate: () => (values: Record<string, any>) => FieldErrors;
  initialValues?: Record<string, any>;
};

/**
 * Export `FormController`.
 */

export class FormController {

  /**
   * Fields.
   */

  private readonly fields: {
    errors: Record<string, FieldError>;
    meta: Record<string, FieldMeta>;
    values: Record<string, any>;
  };

  /**
   * Submit status.
   */

  private submitStatus: SubmitStatus = SubmitStatus.Idle;

  /**
   * Field change listeners.
   */

  private readonly fieldChangeListeners: Record<string, Set<() => void>> = {};

  /**
   * Form values listeners.
   */

  private readonly formValuesListeners: Set<() => void> = new Set();

  /**
   * Get validate.
   */

  private readonly getValidate: () => (values: Record<string, any>) => FieldErrors;

  /**
   * Constructor.
   */

  constructor(options: FormStateOptions) {
    const { getValidate, initialValues = {} } = options;

    this.getValidate = getValidate;
    this.fields = {
      errors: this.getValidationErrors(initialValues),
      meta: {},
      values: initialValues
    };
  }

  /**
   * Get validation errors.
   */

  private getValidationErrors(values: Record<string, any>): FieldErrors {
    const validate = this.getValidate();

    return validate(values);
  }

  /**
   * Register field.
   */

  registerField(fieldName: string) {
    // Register the property on the `values` and `meta` objects,
    // use existing values if already registered.
    this.fields.values = {
      ...this.fields.values,
      [fieldName]: this.fields.values[fieldName]
    };

    this.fields.meta = {
      ...this.fields.meta,
      [fieldName]: this.fields.meta[fieldName] ?? initialFieldMeta
    };

    // Validate new values.
    this.fields.errors = this.getValidationErrors(this.fields.values);
  }

  /**
   * Emit field change.
   */

  private emitFieldChange(fieldName: string) {
    const fieldChangeListeners = this.fieldChangeListeners[fieldName];

    if (!fieldChangeListeners) {
      return;
    }

    for (const listener of fieldChangeListeners) {
      listener();
    }
  }

  /**
   * Emit form values change.
   */

  private emitFormValuesChange() {
    for (const listener of this.formValuesListeners) {
      listener();
    }
  }

  /**
   * Update field meta.
   */

  private updateFieldMeta(fieldName: string, newMeta: Partial<FieldMeta>) {
    this.fields.meta = {
      ...this.fields.meta,
      [fieldName]: {
        ...this.fields.meta[fieldName] ?? initialFieldMeta,
        ...newMeta
      }
    };
  }

  /**
   * Set field value.
   */

  setFieldValue(fieldName: string, value: any) {
    this.fields.values = {
      ...this.fields.values,
      [fieldName]: value
    };

    this.updateFieldMeta(fieldName, { dirty: true });
    this.fields.errors = this.getValidate()(this.fields.values);
    this.emitFieldChange(fieldName);
    this.emitFormValuesChange();
  }

  /**
   * Get field value.
   */

  getFieldValue(fieldName: string): any {
    return this.fields.values[fieldName];
  }

  /**
   * Get values.
   */

  getValues() {
    return this.fields.values;
  }

  /**
   * Get errors.
   */

  getErrors() {
    return this.fields.errors;
  }

  /**
   * Get fields meta.
   */

  getFieldsMeta() {
    return this.fields.meta;
  }

  /**
   * Add field change listener.
   */

  addFieldChangeListener(fieldName: string, listener: () => void) {
    this.fieldChangeListeners[fieldName] = this.fieldChangeListeners[fieldName] ?? new Set();
    this.fieldChangeListeners[fieldName].add(listener);

    return () => {
      this.fieldChangeListeners[fieldName].delete(listener);
    };
  }

  /**
   * Add form values listener.
   */

  addFormValuesListener(listener: () => void) {
    this.formValuesListeners.add(listener);

    return () => {
      this.formValuesListeners.delete(listener);
    };
  }

  /**
   * Focus field.
   */

  focusField(fieldName: string) {
    this.updateFieldMeta(fieldName, { active: true });
    this.emitFieldChange(fieldName);
  }

  /**
   * Blur field.
   */

  blurField(fieldName: string) {
    this.updateFieldMeta(fieldName, { active: false, touched: true });
    this.emitFieldChange(fieldName);
  }

  /**
   * Get field meta.
   */

  getFieldMeta(fieldName: string): FieldMeta {
    return this.fields.meta[fieldName] ?? initialFieldMeta;
  }

  /**
   * Get field error.
   */

  getFieldError(fieldName: string): FieldError | null {
    return this.fields.errors[fieldName] ?? null;
  }

  /**
   * Get meta.
   */

  getMeta() {
    const errors = this.getErrors();
    const fieldsMeta = this.getFieldsMeta();

    return {
      active: Object.values(fieldsMeta).some(({ active }) => active),
      dirty: Object.values(fieldsMeta).some(({ dirty }) => dirty),
      hasErrors: Object.entries(errors).length > 0,
      touched: Object.values(fieldsMeta).some(({ touched }) => touched)
    };
  }

  /**
   * Reset.
   */

  reset(newValues: Record<string, any> = {}) {
    this.fields.values = newValues;
    this.fields.meta = Object.fromEntries(
      Object.entries(this.fields.meta).map(([fieldName, meta]) => {
        return [fieldName, {
          ...meta,
          active: false,
          dirty: false,
          touched: false
        }];
      })
    );

    this.fields.errors = this.getValidationErrors(this.fields.values);

    // TODO: Emit field changes.
    this.emitFormValuesChange();
  }

  /**
   * Get submit status.
   */

  getSubmitStatus(): SubmitStatus {
    return this.submitStatus;
  }

  /**
   * Submit to.
   */

  async submitTo(submit: (values: Record<string, any>) => Promise<any> | void) {
    try {
      this.submitStatus = SubmitStatus.Submitting;
      // TODO: Set all fields to touched.
      this.fields.errors = this.getValidationErrors(this.fields.values);

      if (Object.keys(this.fields.errors).length > 0) {
        return;
      }

      return await submit(this.fields.values);
    } finally {
      this.submitStatus = SubmitStatus.Idle;
    }
  }

}
