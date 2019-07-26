
/**
 * Babel configuration.
 */

module.exports = {
  env: {
    test: {
      presets: [
        ['@babel/preset-env', {
          targets: { node: 'current' }
        }]
      ]
    }
  },
  plugins: [
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining',
    ['module-resolver', {
      alias: {
        test: './test'
      },
      root: ['./src']
    }]
  ],
  presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-flow']
};
