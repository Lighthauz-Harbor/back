var webpack = require("webpack");
var path = require("path");

var HtmlWebpack = require("html-webpack-plugin");
var ChunkWebpack = webpack.optimize.CommonsChunkPlugin;
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        app: [ 
            path.resolve(__dirname, "app", "bootstrap"), 
        ],
        vendor: [ 
            path.resolve(__dirname, "app", "vendor") 
        ],
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            {
                test: /\.html$/,
                loader: "raw"
            },
            {
                exclude: /node_modules/,
                test: /\.ts$/,
                loaders: ["ts", "angular2-template-loader"]
            }
        ]
    },
    output: {
        filename: "[name].bundle.js",
        publicPath: "/",
        path: path.resolve(__dirname, "dist"),
    },
    plugins: [
        new ChunkWebpack({
            filename: "vendor.bundle.js",
            minChunks: Infinity,
            name: "vendor"
        }),
        new HtmlWebpack({
            filename: "index.html",
            inject: "body",
            template: path.resolve(__dirname, "app", "index.html")
        }),
        new ExtractTextPlugin("styles.css")
    ],
    resolve: {
        extensions: [ "", ".js", ".ts" ]
    }
};