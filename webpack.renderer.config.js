const CopyPlugin = require('copy-webpack-plugin')

const rules = require('./webpack.rules')

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
})

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
  externals: {
    'better-sqlite3': 'commonjs better-sqlite3',
  },
  plugins: [
    new CopyPlugin([
      {
        from: './node_modules/better-sqlite3/',
        to: './renderer/node_modules/better-sqlite3', // still under node_modules directory so it could find this module
      },
    ]),
    new CopyPlugin([
      {
        from: './node_modules/better-sqlite3/',
        to: './node_modules/better-sqlite3', // still under node_modules directory so it could find this module
      },
    ]),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    //modules: ['node_modules', 'tools'],
    //alias: {
    //  'node-pre-gyp': 'node-pre-gyp-bypass',
    //},
  },
}
