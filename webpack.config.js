var path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin'); //installed via npm
const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm

const config = {
  distDir: path.join(__dirname, 'dist')
}

module.exports = { 
  entry: './src/index.js',
  output: {
    filename: '[name].bundle.js',
    path: config.distDir
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: config.distDir,
  },
  resolve: {
      // Add `.ts` and `.tsx` as a resolvable extension.
      extensions: ['.ts', '.js']
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: 'ts-loader' },
      { 
        test: /\.(svg|json|csv)$/, 
        loader: 'file-loader',
        options: {
          outputPath: 'dist'
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Binding Landscape'
    })
  ]
}