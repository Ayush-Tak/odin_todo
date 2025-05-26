const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development', // Sets the mode to development
  entry: './src/index.js', // Your main JavaScript file
  output: {
    filename: 'main.js', // The name of the bundled file
    path: path.resolve(__dirname, 'dist'), // The output directory
    clean: true, // Cleans the dist folder before each build
  },
  devtool: 'inline-source-map', // Helps with debugging
  devServer: {
    static: './dist', // Serves files from the dist directory
    open: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Odin Todo App', // The title of your HTML page
      template: './src/index.html' // Optional: if you have an HTML template in src
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i, // For CSS files
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i, // For image assets
        type: 'asset/resource',
      },
    ],
  },
};