const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
    entry: path.join(__dirname, '../src/index.js'),
    output: {
        path: path.join(__dirname, '../build'),
        filename: 'js/[name]-[hash:8].js'
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.wasm', '.mjs', '.js', '.json','.jsx']
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true
                }
            },{
                test: /\.(c|sa|sc)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: true,
                            hmr: true,
                            reloadAll: true,
                        }
                    },{
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            // localIdentName: '[path][name]__[local]--[hash:base64:5]',
                        }
                    },"postcss-loader", "sass-loader"
                ]
            },{
                test: /\.(c|le)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: true,
                            hmr: true,
                            reloadAll: true,
                        }
                    },{
                        loader: 'css-loader',
                        options: {
                            modules: true,
                        }
                    },"postcss-loader", "less-loader"
                ]
            },{
                test: /\.(png|jpe?g|gif|webp)$/,
                loader: 'url-loader',
                options: {
                    limit: 4096,
                    name: '[name].[ext]'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '../public/index.html'),
            filename: 'index.html',
            minify: !isDev,
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: 'css/[id].css',
        }),
        new webpack.DllReferencePlugin({
            manifest: path.resolve(__dirname,'dll','manifest.json')
        }),
        new OptimizeCssAssetsPlugin({
            cssProcessorOptions: {
                map: {
                    inline: false,
                    annotation: true,
                }
            }
        })
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 3000,
            maxSize: 0,
            cacheGroups: {
                vendors: {      // 第三方模块
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    priority: 10,
                    minChunks: 1,
                    chunks: 'initial'
                },
                common: {   // 公共模块
                    name: 'common',
                    priority: 1,
                    minChunks: 2,
                    chunks: 'initial'
                }
            }
        }
    }
};