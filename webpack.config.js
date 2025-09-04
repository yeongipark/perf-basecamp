const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin'); // 추가

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  return {
    entry: './src/index.tsx',
    resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
    output: {
      filename: 'bundle.js',
      path: path.join(__dirname, '/dist'),
      clean: true // build 전 dist 폴더 정리
    },
    devServer: {
      hot: true,
      open: true,
      historyApiFallback: true
    },
    devtool: isProduction ? false : 'source-map', // 파일의 계층 구조를 계층적으로 보여줌
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html'
      }),
      new CopyWebpackPlugin({
        patterns: [{ from: './public', to: './public' }]
      }),
      new Dotenv()
    ],
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/i,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader'
          }
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
          loader: 'file-loader',
          options: {
            name: 'static/[name].[ext]'
          }
        }
      ]
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true,
              dead_code: true,
              unused: true
            },
            format: {
              comments: false,
              beautify: false // 코드 예쁘게 출력 안 하고 한 줄로 압축
            },
            //변수/함수 이름 난독화(짧게 줄임).
            mangle: {
              toplevel: true
            }
          }
        })
      ]
    }
  };
};
