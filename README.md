# Seegno React Forms

Manage React form state the easy way and validate with [json-schema](https://json-schema.org/).

## Installation

```sh
yarn add @seegno/react-forms
```

Make sure you have at least version 16.8 of React:

```sh
yarn add react@^16.8.0
```

## Usage

```js
import { FormProvider, useField } from '@seegno/react-forms';

function Input({ name }) {
  const { onChange, value } = useField(name);

  return (
    <input
      name={name}
      onChange={event => onChange(event.target.value)}
      value={value}
    />
  );
}

function Form() {
  return (
    <FormProvider
      jsonSchema={{
        properties: {
          foo: { type: 'string' }
        },
        type: 'object'
      }}
      onSubmit={values => console.log('submit', values)}
    >
      {({ submit }) => (
        <form onSubmit={submit}>
          <Input name={'foo'} />

          <button type={'submit'}>
            {'Submit'}
          </button>
        </form>
      )}
    </FormProvider>
  );
}
```

## Tests

Run the tests from the root directory:

```sh
yarn test
```

## Contributing & Development

### Contributing

Found a bug or want to suggest something?
Take a look first on the current and closed [issues](https://github.com/seegno/react-forms/issues).
If it is something new, please [submit an issue](https://github.com/seegno/react-forms/issues/new).

### Develop

It will be awesome if you can help us evolve `@seegno/react-forms`.
Want to help?

1. [Fork it](https://github.com/seegno/react-forms).
2. Install the dependencies with `yarn`.
3. Hack away.
4. Run the tests: `yarn test`.
5. Create a [Pull Request](https://github.com/seegno/react-forms/compare).
