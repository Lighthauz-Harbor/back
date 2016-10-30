var webpack = require("webpack");
var path = require("path");

const HtmlWebpack = require("html-webpack-plugin");
const ChunkWebpack = webpack.optimize.CommonsChunkPlugin;

module.exports = {
    entry: {
        app: [ path.resolve(__dirname, "app", "bootstrap") ],
        vendor: [ path.resolve(__dirname, "app", "vendor") ]
    },
    module: {
        loaders: [
            {
                test: /\.(css|html)$/,
                loader: "raw"
            },
            {
                exclude: /node_modules/,
                test: /\.ts$/,
                loader: "ts"
            }
        ]
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist");
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
        })
    ],
    resolve: {
        extensions: [ "", ".js", ".ts" ]
    }
};