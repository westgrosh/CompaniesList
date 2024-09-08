const path = require("path");
const pkg = require('./package.json');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./react_app/index.js",

    // Для того чтобы сервер Tomcat видел изменения при build
    output: {
        path: path.resolve(__dirname + '/../resources/static/'),
        filename: pkg.main,
        library: {
            name: 'components',
            type: 'umd',
            umdNamedDefine: true
        },
        publicPath: "/CompaniesList/" // root
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: [
                            "@babel/plugin-transform-react-jsx",
                            "@babel/plugin-proposal-class-properties"
                        ]
                    }
                }
            },
            {
                test: /\.svg$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'svg-inline-loader'
                }
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader", // 3. Inject styles into DOM
                    "css-loader", // 2. Turns css into commonjs
                    "sass-loader", // 1. Turns sass into css
                ],
            },
            {
                test: /\.(css|less)$/,
                use: ["style-loader", "css-loader", "less-loader"]
            }
        ]
    },

    /*
    *  devServer - работаем локально с React и сервером разработки Webpack (на порту 8090),
    *  React использует свой собственный сервер разработки для обслуживания своих файлов и не имеет доступа к объектам Spring Boot,
    *  таким как ${message}.
    *  (смотри index.html)
    * */

    devServer: {
        historyApiFallback: {
            index: '/CompaniesList/'    // Добавлено
        },
        static: {
            directory:  path.join('../webapp/'), // путь к статическим файлам index.html для локальной разработки ( Content not from webpack is served from ..)
        },
        port: 8090,
        proxy: [
            {
                context: '**',
                target: 'http://localhost:8082',
                secure: false,
                prependPath: false,
            }
        ],
        hot: true
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve('../resources/templates/index.html'), // путь до вашего html файла, который используется в качестве шаблона
        }),
    ],

};