const paths = require('./paths');
const Dotenv = require('dotenv-webpack');
const { ModuleFederationPlugin } = require('webpack').container;
const deps = require('../package.json').dependencies;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: `${paths.src}/index.js`,
  output: {
    path: paths.build,
  },
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    open: false,
    compress: true,
    port: 3001,
    hot: true,
  },

  module: {
    rules: [
      // JavaScript: Use Babel to transpile JavaScript files
      {
        test: /\.?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      }
    ],
  },

  plugins: [
    new Dotenv(),
    new ModuleFederationPlugin({
      name: 'remote',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.js',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: deps.react,
          eager: true
        },
        'react-dom': {
          singleton: true,
          requiredVersion: deps['react-dom'],
          eager: true
        },
      },
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: `${paths.public}/index.html`,
    }),
  ],



  resolve: {
    modules: [
      'node_modules'
    ],
    extensions: ['.js', '.jsx'],
  }
};