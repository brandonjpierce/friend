var webpack = require('webpack');
var path = require('path');
var version = require('./package').version;
var banner = 'Friend.js v' + version + ' :: by Brandon Pierce (brandon@brandonjpierce.com) MIT';

module.exports = {
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'friend.js',
    library: 'Friend',
    libraryTarget: 'umd'
  },
  resolve: {
    modulesDirectories: ['node_modules', 'src'],
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.BannerPlugin(banner),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin()
  ]
};
