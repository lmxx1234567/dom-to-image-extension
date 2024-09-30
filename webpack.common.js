const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    popup: './popup.js', // Entry point for your popup script
    content: './content.js', // Entry point for your content script
  },
  output: {
    filename: '[name].js', // Output all bundles (e.g., popup.js)
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    // Clean the dist folder before every build
    new CleanWebpackPlugin(),
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
  ],
};