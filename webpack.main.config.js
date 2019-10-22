const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main.js',
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  // declare better-sqlite3 external and copy all of it
  // see https://github.com/electron-userland/electron-forge/issues/1224#issuecomment-544294836
  // and https://github.com/electron-userland/electron-forge/issues/1224#issuecomment-544204354
  // and https://github.com/electron-userland/electron-forge/issues/1224#issuecomment-544294836
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
  },
}
