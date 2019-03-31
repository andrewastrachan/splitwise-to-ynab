module.exports = function (api) {
  const babelEnv = api.env();

  const presets = [
    [
      '@babel/env',
      {
        targets: '> 1% in US, last 2 versions, not dead',
        useBuiltIns: 'usage'
      }
    ]
  ];

  const plugins = [
    '@babel/plugin-proposal-object-rest-spread',
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        root: ['./src/'],
        alias: {
          '*out': './out',
          '*src': './src',
          '*shared': './src/shared',
          '*errors': './src/errors'
        }
      }
    ]
  ];

  return {
    presets,
    plugins
  };
};
