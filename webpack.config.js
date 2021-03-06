// webpack.config.js

'use strict';

const path = require("path");
const { styles } = require('@ckeditor/ckeditor5-dev-utils');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './index.js',

  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },

  mode: 'development',

  resolve: {
    extensions: ['.js'],
    modules: [path.basename(__dirname) + "/node_modules"]
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          { loader: 'babel-loader' }
        ],
        exclude: /node_modules/
      }, 
      {
        test: /\.html$/,
        use: [
          { loader: 'file-loader', options: { name: '[name].html' } },
          { loader: 'extract-loader' },
          { loader: 'html-loader', options: { attrs: ['img:src'] } },
        ]
      }, 
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        use: [
          { loader: 'file-loader', options: { name: '[name].[ext]' } },
        ]
      }, 
      {
        test: /\.svg$/,
        use: [
          { loader: 'raw-loader' },
        ]
      }, 
      {
        oneOf: [
          {
            test: /ckeditor5-[^/]+\/theme\/[\w-/]+\.css$/,
            use: [
              { loader: 'style-loader', options: { injectType: "singletonStyleTag" } },
              {
                loader: 'postcss-loader',
                options: styles.getPostCssConfig({
                  themeImporter: {
                    themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
                  },
                  minify: true
                })
              }
            ]
          }, {
            test: /\.css$/,
            use: [
              { loader: 'style-loader' },
              { loader: 'css-loader' }
            ]
          }
        ]
      }
    ]
  },
  plugins: [
     new CleanWebpackPlugin(),
    // copy the index.html and templated to eidtor filder
    new CopyWebpackPlugin([
        {
            from: './plugin',
            to: './plugin'
        },
        {
          from: './index.html',
          to: './'
        }
    ]),
    new ZipPlugin({
        path: path.join(__dirname, './dist'),
        filename: 'popupui.zip',
        fileOptions: {
            mtime: new Date(),
            compress: true,
            forceZip64Format: false,
        },
        zipOptions: {
            forceZip64Format: false,
        },
    })
  ]
};
