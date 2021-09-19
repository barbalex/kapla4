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
  plugins: [
    // dont know why but now have to copy image
    new CopyPlugin({
      patterns: [
        {
          from: './src/etc/app.ico',
          to: './src/etc/app.ico',
        },
      ],
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
}
