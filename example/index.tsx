
/**
 * Module dependencies.
 */

import { FormProvider, useField, useFormState } from '../src';
import ReactDOM from 'react-dom';

/**
 * `Input` component.
 */

function Input({ label, name, type = 'text' }) {
  const { meta, onBlur, onChange, onFocus, value } = useField(name);

  return (
    <label>
      <span
        style={{
          color: meta.active ? 'rebeccapurple' : 'initial'
        }}
      >
        {label}
      </span>

      <input
        name={name}
        onBlur={onBlur}
        onChange={event => onChange(event.target.value)}
        onFocus={onFocus}
        type={type}
        value={value ?? ''}
      />
    </label>
  );
}

/**
 * `RerenderTester` component.
 */

function RerenderTester() {
  console.log('RerenderTester rendered'); // eslint-disable-line no-console

  return (
    <div>
      {'Re-render tester'}
    </div>
  );
}

/**
 * `SubmitButton` component.
 */

function SubmitButton() {
  const { isSubmitting } = useFormState();

  return (
    <button
      disabled={isSubmitting}
      type={'submit'}
    >
      {isSubmitting ? 'Submitting' : 'Submit'}
    </button>
  );
}

/**
 * `App` component.
 */

function App() {
  return (
    <div>
      <h1>{'Hello world!'}</h1>

      <FormProvider
        initialValues={{}}
        jsonSchema={{}}
        onSubmit={values => {
          console.log('submit', values); // eslint-disable-line no-console

          return new Promise(resolve => {
            setTimeout(() => resolve, 5000);
          });
        }}
      >
        {({ submit }) => (
          <form onSubmit={submit}>
            <RerenderTester />

            <Input
              label={'Name'}
              name={'name'}
            />

            <Input
              label={'Email'}
              name={'email'}
            />

            <SubmitButton />
          </form>
        )}
      </FormProvider>
    </div>
  );
}

/**
 * Render app.
 */

ReactDOM.render(<App />, document.getElementById('app'));
