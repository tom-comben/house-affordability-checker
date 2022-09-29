const path = require("path");

module.exports = {
  resolve: {
    modules: [path.resolve("./lib"), path.resolve("./node_modules")],
  },
  mode: "development",
  entry: "./lib/components/index.js",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, use: "babel-loader" },
      {
        test: /\.s[ac]ss$/i,
        exclude: /node-modules/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
};
