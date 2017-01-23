var path = require('path');

module.exports = {
  entry: './web/static/js/index.js',
  output: {
    path: path.join(__dirname, 'priv', 'static', 'js'),
    filename: 'app.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    modules: [ 'node_modules', __dirname + '/web/static/js' ]
  }
};
