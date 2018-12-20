const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            options: {
                plugins: [
                    'syntax-dynamic-import',
                    'transform-runtime'
                ],
                presets: [
                    'env',
                    'es2015',
                    'stage-2'
                ],
                cacheDirectory: true
            },
            exclude: [/node_modules/, path.resolve('src/lib/ueditor')]
        }, {
            test: /\.html$/,
            use: 'html-loader'
        }, {
            test: /\.(css|scss|less)$/,
            use: ['style-loader', 'css-loader', 'sass-loader', {
                loader: 'postcss-loader',
                options: {
                    plugins: () => [
                        require('autoprefixer')({
                            browsers: [
                                'last 10 Chrome versions',
                                'last 5 Firefox versions',
                                'Safari >= 6',
                                'ie > 8'
                            ]
                        })
                    ]
                }
            }]
        }, {
            test: /\.(png|jpg|gif|svg|eot|ttf|woff)$/,
            use: 'url-loader'
        }]
    },
    ////// 
    entry: {
        index: ['./src/index.js']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    plugins: [

    ],
    resolve: {
        alias: {
            '@': path.resolve('src'),
        }
    },
    devServer: {
        host: '0.0.0.0',
        // host: 'localhost',
        hot: true,
        open: true,
        inline: true,
        compress: true,
        // contentBase: path.resolve(__dirname, './'),
        // publicPath: '/dist/',
        proxy: {
            '/test': {
                target: 'http://test.mediportal.com.cn/',
                changeOrigin: true,
                pathRewrite: {
                    '^/test': ''
                }
            },
            '/dev': {
                target: 'http://192.168.3.231/',
                changeOrigin: true,
                pathRewrite: {
                    '^/dev': ''
                }
            }
        }

    }
};
// 开发
if (process.env.NODE_ENV === 'development') {
    module.exports.devtool = '#cheap-module-source-map'
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            inject: true,
            hash: true,
            cache: true,
            filename: './index.html',
            template: './index.html.tpl',
            inject: 'head'
        })
    ])
}
// 发布
else if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map';
}