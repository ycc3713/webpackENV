'use strict'
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 抽离css样式的插件 使用这个需要自己去压缩

const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin') // 使用OptimizeCSSAssetsPlugin只能压缩css而js会覆盖为不压缩。所有使用这个插件。terset-webpack-plugin插件也可以


function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    entry: {
        app: './src/main.js'
    },
    mode: 'production', // 默认两种  生产和开发
    output: {
        path: path.resolve(__dirname, 'dist'), // 路径必须是绝对路径
        filename: '[name].[hash].js', // 打包后的文件名。
        // publicPath: process.env.NODE_ENV === 'production'
        //   ? config.build.assetsPublicPath
        //   : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
        }
    },
    devServe: { // 开发服务器的配置
        port: 3000,
        compress: true,
        progress: true,
        contentBase: './dist'
    },
    external:{ // 生产环境引cdn 防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖
        vue: 'Vue',
        axios: 'axios',
        'vue-router': 'VueRouter',
        echarts: 'echarts',
        nprogress: 'NProgress',
        vuex: 'Vuex'
    },
    optimization: { // 压缩优化项
        minimizer: [
            new UglifyJsPlugin({
                // uglifyOptions: {
                //     mangle: {
                //         safari10: true
                //     }
                // },
                // sourceMap: '',
                cache: true, // 使用缓存
                parallel: true // 可以并行打包
            }),
            // Compress extracted CSS. We are using this plugin so that possible
            // duplicated CSS from different components can be deduped.
            new OptimizeCSSAssetsPlugin()
        ]

    },
    plugins: [ // 数组存放所有的webpack插件
        new HtmlWebpackPlugin({
            template: './src/index.html', // 以src下的index.html为打包模板
            filename: 'index.html', // 打包模板后生成的文件名称
            minify: { // 压缩操作  压缩html
                removeAttributeQuotes: true, // 删除掉双引号
                collapseWhitespace: true, // 折叠空行消除空格变成一行
            },
            hash: true, // 生成哈希戳，每次打包生成不同的文件防止缓存
        }),
        new MiniCssExtractPlugin({ // 抽离css的插件
            // filename: utils.assetsPath('css/[name].[contenthash:8].css'),
            // chunkFilename: utils.assetsPath('css/[name].[contenthash:8].css')
            filename: 'main.css',
            chunkFilename: 'main.css'
        }),
    ],
    module: {
        rules: [ // loader的特点 希望单一  
            // css-loader 处理@import语法 style-loader 是把css插入到head的标签中
            { // loader 处理顺序是默认从右向左执行  从下向上执行
                test: '/\.css$/',
                use: [ // 这里也可以写成对象的形式，好处是可以添加参数选项
                    {
                        loader: 'style-loader',
                        options: {
                            insertAt: 'top' // 将style 标签插入到head上部，这样自己写的标签就会优先生效
                        }
                    },
                    'css-loader', // 从下往上执行，先解析css 再使用style-loader插入css代码
                    'postcss-loader' // 在解析css之前 加上这个loader作用给样式加上前缀。ps:-websit-transform...。并在目录中新建postcss.config.js配置文件
                ]
            },
            {
                test: '/\.css$/',
                use: [
                    // {
                    //     loader: 'style-loader',
                    //     options: {
                    //         insertAt: 'top'
                    //     }
                    // },
                    MiniCssExtractPlugin.loader(), // 抽离css插件中的一个loader，以link的方式插入到head中
                    'css-loader',
                    'postcss-loader', // 在解析css之前 加上这个loader作用给样式加上前缀。ps:-websit-transform...。并在目录中新建postcss.config.js配置文件
                    'less-loader'
                ]
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src')],
                exclude: '/node_modules/',
                options: {
                    presets: [ // 大的语法插件
                        '@babel/preset-env'
                    ],
                    plugins:[ // 配置各别语法小插件
                        ["@babel/plugin-proposal-decorators", { "legacy": true }], // 这两个处理装饰器语法  可以到babel官网看
                        ["@babel/plugin-proposal-class-properties", { "loose" : true }], // 处理类  顺序不能变
                        "@babel/plugin-transform-runtime", 
                    ]
                }
            },
        ]
    },

}