
/**
 * Module dependencies.
 */

import { render } from '@testing-library/react';
import FormProvider from 'components/form-provider';
import React from 'react';

/**
 * `FormProvider` component tests.
 */

describe('FormProvider', () => {
  it('should render its children', () => {
    const { container } = render(
      <FormProvider
        jsonSchema={{ type: 'object' }}
        onSubmit={() => Promise.resolve()}
      >
        {'foo'}
      </FormProvider>
    );

    expect(container).toHaveTextContent('foo');
  });

  it('should call children with `reset` and `submit`', () => {
    const children = jest.fn();

    render(
      <FormProvider
        jsonSchema={{ type: 'object' }}
        onSubmit={() => Promise.resolve()}
      >
        {children}
      </FormProvider>
    );

    expect(children).toHaveBeenCalledTimes(1);
    expect(children).toHaveBeenCalledWith({
      reset: expect.any(Function),
      submit: expect.any(Function)
    });
  });
});
