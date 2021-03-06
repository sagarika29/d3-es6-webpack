"use strict";

const webpack            = require('webpack');
const path               = require('path');
const ExtractTextPlugin  = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin  = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        'vendor': ['d3'],
        'app': path.resolve(__dirname,'src/app.js')
    },
    output: {
        path: path.resolve(__dirname,'dist'),
        filename: 'scripts/[name].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },
            {
                test: /\.html$/,
                use: [ {
                    loader: 'html-loader',
                    options: {
                        minimize: true,
                        removeComments: false,
                        collapseWhitespace: false
                    }
                }]
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            }

        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new webpack.optimize.CommonsChunkPlugin({name: "vendor", minChunks: Infinity,}),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            inject: 'body'
        }),
        new ExtractTextPlugin("styles/app.css")
    ]

};