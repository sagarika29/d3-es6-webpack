"use strict";

const path   = require('path');
const merge  = require('webpack-merge');

const common = require('./webpack.prod.js');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.resolve(__dirname,'dist'),
        compress: true,
        port: 3000
    }
});