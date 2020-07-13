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
  // declare better-sqlite3 external and copy all of it
  // see https://github.com/electron-userland/electron-forge/issues/1224#issuecomment-544294836
  // and https://github.com/electron-userland/electron-forge/issues/1224#issuecomment-544204354
  // and https://github.com/electron-userland/electron-forge/issues/1224#issuecomment-544294836
  externals: {
    'better-sqlite3': 'commonjs better-sqlite3',
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: './node_modules/better-sqlite3/',
          to: './renderer/node_modules/better-sqlite3', // still under node_modules directory so it could find this module
        },
      ],
    }),
    new CopyPlugin({
      patterns: [
        {
          from: './node_modules/better-sqlite3/',
          to: './node_modules/better-sqlite3', // still under node_modules directory so it could find this module
        },
      ],
    }),
    new CopyPlugin({
      patterns: [
        {
          from: './src/etc/app.ico',
          to: './src/etc/app.ico', // still under node_modules directory so it could find this module
        },
      ],
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
}
