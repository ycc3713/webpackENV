const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin') // 输出工具
const CleanWebpackPlugin = require('clean-webpack-plugin') // 清除掉dist文件

module.exports = {
    entry: './src/main.js',
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
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
    plugin:[
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: 'Output Management'
      })
    ]
}