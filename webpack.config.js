const path = require("path");
const dotEnv = require("dotenv-webpack");

module.exports = {
  resolve: {
    modules: [path.resolve("./src"), path.resolve("./node_modules")],
  },
  mode: "development",
  entry: "./src/components/index.js",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js",
  },
  plugins: [new dotEnv()],
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
