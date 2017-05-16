const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/app.js',
    output: {
        path: path.join(__dirname,'dist'),
        filename: 'bundle.js'
    },

    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract(
                    "css-loader?sourceMap!less-loader?sourceMap"
                )
            },
            {
                test: /\.hbs$/,
                loader: 'handlebars-loader' },
            {test: /\.(jpe?g|png|gif|svg)$/i, loader: "file-loader?name=icons/[name].[ext]"}
        ]
    },
    plugins: [
        new HtmlPlugin({
            template: './index.hbs',
            filename: 'index.html'
        }),
        new ExtractTextPlugin('styles.css')
    ],
    devServer: {
        contentBase: [
            "dist"
        ],
        inline: true,
        "port": 8289,
        hotOnly: true
    },
    watch:true
};
