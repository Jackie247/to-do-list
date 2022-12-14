const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    index: { import: "./src/index.js", dependOn: "shared" },
    interface: { import: "./src/interface.js", dependOn: "shared" },
    project: { import: "./src/project.js", dependOn: "shared" },
    task: { import: "./src/task.js", dependOn: "shared" },
    app: { import: "./src/localStorage.js", dependOn: "shared" },
    shared: "lodash",
  },
  output: {
    filename: "[name].[chunkhash].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
    assetModuleFilename: "[name][ext]",
  },
  devtool: false,
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        include: path.resolve(
          __dirname,
          "./node_modules/bootstrap-icons/font/fonts"
        ),
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "webfonts",
            publicPath: "../webfonts",
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/template.html",
    }),
  ],
};
