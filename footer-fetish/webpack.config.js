const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const REMOVE_STYLES_JS = 'RemoveStylesJSPlugin'
outputPath = path.resolve(__dirname, 'public');

module.exports = {
  target: 'web',
  output: {
    filename: '[name].bundle.js',
    path: outputPath,
  },
  entry: {
    global: './src/global.css',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          'css-loader',
        ]
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap(REMOVE_STYLES_JS, compilation => {
          try {
            fs.unlinkSync(path.join('./dist', 'global.bundle.js'))
          } catch (e) {
            compilation.getLogger(REMOVE_STYLES_JS).warn(`${REMOVE_STYLES_JS} failed`)
          }
        });
      }
    },
  ],
  devServer: {
    publicPath: '/',
    contentBase: outputPath,
    watchContentBase: true,
    compress: true,
    port: 9001
  },
}