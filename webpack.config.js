const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production', // You can switch this to 'development' for easier debugging
  entry: {
    popup: './popup.js', // Entry point for your popup script
  },
  output: {
    filename: '[name].bundle.js', // Output all bundles (e.g., popup.bundle.js)
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    // Copy static files like manifest.json, icons, and any other assets to 'dist' folder
    new CopyWebpackPlugin({
      patterns: [
        { from: 'manifest.json', to: '.' }, // Copy manifest.json to dist/
        { from: 'images/', to: 'images/' }, // Copy images folder to dist/images/
      ],
    }),
    // Automatically include your JavaScript bundle in popup.html
    new HtmlWebpackPlugin({
      filename: 'popup.html', // Output file in the 'dist' folder
      template: './popup.html', // Source template file
      inject: 'body', // Inject the JavaScript bundle into the body
      chunks: ['popup'], // Specify the bundle to include
    }),
  ]
};