const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

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
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  mode: 'development',
  resolve: {
    extensions: ['.js', '.jsx', 'json'],
    alias: {
      api: path.resolve(__dirname, 'api/'),
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
      // {
      //   test: /\.(sc|c)ss$/,
      //   use: [
      //     MiniCssExtractPlugin.loader,
      //     'css-loader',
      //     'sass-loader'
      //   ]
      // },
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
      server: { baseDir: ['dist'] },
    }),
    // new MiniCssExtractPlugin(),
  ],
};
