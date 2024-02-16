const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ThemeWatcher = require('@salla.sa/twilight/watcher.js');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
var spawn = require('child_process').spawn

console.log('naif');
const find = spawn('find', ['.', '-type', 'f']);
const wc = spawn('wc', ['-l']);

find.stdout.pipe(wc.stdin);

wc.stdout.on('data', (data) => {
    console.log(`Number of files ${data}`);
});
const asset = file => path.resolve('src/assets', file || '');
const public = file => path.resolve("public", file || '');

module.exports = {
    entry: {
        app: [asset('styles/app.scss'), asset('js/wishlist.js'), asset('js/app.js'), asset('js/exec.js')],
        home: asset('js/home.js'),
        'product-card': asset('js/partials/product-card.js'),
        checkout: [asset('js/cart.js'), asset('js/thankyou.js')],
        pages: [asset('js/loyalty.js'), asset('js/brands.js'), ],
        product: [asset('js/product.js'), asset('js/products.js')],
        order: asset('js/order.js'),
        testimonials: asset('js/testimonials.js'),

    },
    target: 'node',
    output: {
        path: public(),
        clean: true,
        chunkFilename: "[name].[contenthash].js"
    },
    stats: {
        modules: false,
        assetsSort: "size",
        assetsSpace: 50
    },
    module: {
        rules: [{
                test: /\.js$/,
                exclude: [
                    /(node_modules)/,
                    asset('js/twilight.js')
                ],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                            ["@babel/plugin-transform-runtime",
                                {
                                    "regenerator": true
                                }
                            ]
                        ],
                    }
                }
            },
            {
                test: /\.(s(a|c)ss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            url: false
                        }
                    },
                    "postcss-loader",
                    "sass-loader",
                ]
            },
        ],
    },
    externals: [
        'child_process'
    ],
    plugins: [
        new ThemeWatcher(),
        new MiniCssExtractPlugin(),
        new CopyPlugin({
            patterns: [{
                from: asset('images'),
                to: public('images')
            }]
        }),
    ],
};
