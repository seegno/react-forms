
/**
 * Eslint configuration.
 */

module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true
  },
  extends: [
    'seegno',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: "./tsconfig.json",
    ecmaFeatures: {
        jsx: true
    }
  },
  rules: {
    "import/extensions": [0,"never", {"ts": "never"}]
  },
  settings: {
    "import/resolver": {
      "node": true,
      "eslint-import-resolver-typescript": true
    }
  }
};
