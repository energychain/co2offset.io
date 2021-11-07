const path = require("path");
const { merge } = require("webpack-merge");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const base = require("./webpack.base.config");

module.exports = env => {
  plugins: [
      new CopyWebpackPlugin({
          patterns: [
              { from: '/home/zoernert/Development/co2offset.io', 
                to: 'app'
              }
          ]
      })
  ]
  return merge(base(env), {
    entry: {
      main: "./src/main.js",
      app: "./src/app.js"
    },
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "../app")
    }
  });
};
