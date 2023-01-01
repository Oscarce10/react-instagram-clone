const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const options = {
  extensions: ['js', 'jsx'],
  exclude: [
    '/node_modules/',
    '/api/**',
  ],
};

module.exports = {
  entry: './src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    clean: true,
  },
  devtool: 'source-map',
  mode: 'development',
  resolve: {
    extensions: ['.js', '.jsx', 'json'],
    alias: {
      hooks: path.resolve(__dirname, 'src/hooks/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true },
          },
        ],
      },
    ],
  },
  plugins: [
    new ESLintPlugin(options),
    new HtmlWebpackPlugin(
      {
        inject: true,
        template: './src/index.html',
        filename: './index.html',
      },
    ),
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      server: { baseDir: ['build'] },
    }),
    new Dotenv()
  ],
};
