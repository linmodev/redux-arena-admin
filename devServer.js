var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config.dev');

const port = process.env.npm_package_config_port || 3000;
const host = process.env.npm_package_config_host || 'localhost';

new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: {
        disableDotRule: true
    },
    stats: {
        colors: true,
        chunks: false,
        'errors-only': true
    }
}).listen(port, host, function(err, result) {
    if (err) {
        return console.log(err);
    }
    console.log(`Listening at http://${host}:${port}/`);
});