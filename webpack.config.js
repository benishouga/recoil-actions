const path = require('path');

module.exports = {
  entry: './examples/main.tsx',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'docs')
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig-example.json'
            }
          }
        ]
      }
    ]
  }
};
