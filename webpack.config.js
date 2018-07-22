const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ManifestPlugin = require('webpack-manifest-plugin');
const GenerateJsonFile = require('generate-json-file-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: path.join(__dirname, "./public/index.html"),
    filename: "./index.html",
    title: 'caching'
});
const autoprefixer = require('autoprefixer');

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
                use: ["style-loader",
                    "css-loader",
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                autoprefixer({
                                    browsers: ['ie >= 8', 'last 4 version']
                                })
                            ],
                            sourceMap: true
                        }
                    },
                    "sass-loader"
                ]
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
            },
            {
                type: 'javascript/auto',
                test: /\.json$/,
                use: 'json-loader'
            }
        ]
    },
    plugins: [ 
        htmlWebpackPlugin,
        new webpack.optimize.SplitChunksPlugin({
            name: ['vendors', 'manifest'],
            filename: "vendors.bundle.js"
        }),
        new webpack.HashedModuleIdsPlugin(),
        new ManifestPlugin({
            basePath: '/bundle',
            fileName: 'asset-manifest.json'
        }),
        new SWPrecacheWebpackPlugin({
            dontCacheBustUrlsMatching: /\.\w{8}\./,
            filename: 'service-worker.js',
            logger(message) {
              if (message.indexOf('Total precache size is') === 0) {
                return;
              }
              console.log(message);
            },
            minify: true,
            navigateFallback: '/index.html',
            staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
        }),
        new GenerateJsonFile({
            filename: 'manifest.json',
            jsonFile: './public/manifest.json'
        })
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
        port: 3001,
        hot: true,
        compress: true,
        contentBase: 'dist',
        overlay: true
    }
};