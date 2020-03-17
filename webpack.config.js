const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin') // 输出工具
// const { CleanWebpackPlugin } = require('clean-webpack-plugin') // 清除掉dist文件
const webpack = require('webpack')

module.exports = {
    entry: './src/main.js',
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    devtool: 'inline-source-map',
    module: {
        rules:[
            {
              test: /\.css$/,
              use: [
               'style-loader',
               'css-loader'
              ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                  'file-loader'
                ]
            }
        ]
    },
    plugins:[
      new webpack.LoaderOptionsPlugin({
        options: {
          devServe: {
            contentBase: './dist',
            port: 8080,
            autoOpenBrowser: true,
          }
        }
      }),
      // new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: 'Output Management'
      })
    ],

}