const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
    mode: 'production',
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          parallel: true,
          extractComments: 'all',
        }),
      ],
    },
  };