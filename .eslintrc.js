
/**
 * Eslint configuration.
 */

module.exports = {
  env: {
    browser: 1
  },
  extends: ['seegno'],
  overrides: [{
    extends: [
      'seegno',
      'plugin:@typescript-eslint/recommended',
      'plugin:typescript-sort-keys/recommended'
    ],
    files: ['**/*.ts', '**/*.tsx'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      sourceType: 'module'
    },
    plugins: [
      '@typescript-eslint',
      'typescript-sort-keys'
    ],
    rules: {
      '@typescript-eslint/comma-dangle': 'error',
      '@typescript-eslint/member-delimiter-style': 'error',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-extra-parens': ['error', 'all', {
        ignoreJSX: 'all'
      }],
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-use-before-define': 'error',
      '@typescript-eslint/semi': 'error',
      '@typescript-eslint/type-annotation-spacing': 'error',
      'comma-dangle': 'off',
      'no-extra-parens': 'off',
      'no-use-before-define': 'off',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      semi: 'off'
    }
  }],
  root: true,
  rules: {
    'react/jsx-first-prop-new-line': ['error', 'multiline'],
    'react/jsx-sort-props': ['error', { ignoreCase: false }],
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
