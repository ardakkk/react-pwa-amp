const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: path.join(__dirname, "./public/index.html"),
    filename: "./index.html",
    title: 'caching'
});

const VENDOR_LIBS = [
    'react', 'react-dom', 'prop-types', 'react-hot-loader'
];

module.exports = {
    context:path.resolve(__dirname, "src"),
    entry: {
        app: './index.js',
        vendor: VENDOR_LIBS
    },
    output: {
        path: path.join(__dirname, "/dist"),
        publicPath: '/',
        filename: "[name].[hash].js"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: "babel-loader",
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                use: ['babel-loader','eslint-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                  {
                    loader: 'file-loader',
                    options: {
                            name: '[path][name].[ext]',
                            outputPath: 'images/'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [ 
        htmlWebpackPlugin,
        new webpack.optimize.SplitChunksPlugin({
            name: ['vendors', 'manifest'],
            filename: "vendors.bundle.js"
        }),
        new webpack.HashedModuleIdsPlugin()
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: { test: /[\\/]node_modules[\\/]/, name: "vendors", chunks: "all" }
            }
        }
    },
    resolve: {
        extensions: [".js", ".jsx"],
        alias: {
            style: path.resolve(__dirname, 'src/assets/style'),
            img: path.resolve(__dirname, 'src/assets/img')
        }
    },
    devServer: {
        port: 3001
    }
};