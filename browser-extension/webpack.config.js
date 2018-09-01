var webpack = require("webpack"),
    path = require("path"),
    fileSystem = require("fs"),
    env = require("./scripts/env"),
    CleanWebpackPlugin = require("clean-webpack-plugin"),
    CopyWebpackPlugin = require("copy-webpack-plugin"),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    WriteFilePlugin = require("write-file-webpack-plugin");

// load the secrets
var alias = {
  bindings: path.join(__dirname, 'aliased-modules', 'node-bindings'),
  dnode: path.join(__dirname, 'aliased-modules', 'dnode'),
  __original_dnode__: require.resolve('dnode'),
};

var secretsPath = path.join(__dirname, ("secrets." + env.NODE_ENV + ".js"));

var fileExtensions = ["jpg", "jpeg", "png", "gif", "eot", "otf", "svg", "ttf", "woff", "woff2"];

if (fileSystem.existsSync(secretsPath)) {
  alias["secrets"] = secretsPath;
}

var options = {
  entry: {
    popup: ['babel-polyfill', path.join(__dirname, "src", "popup.js")],
    // options: ['babel-polyfill', path.join(__dirname, "src", "options.js")],
    background: ['babel-polyfill', path.join(__dirname, "src", "background.js")],
    contentscript: ['babel-polyfill', path.join(__dirname, "src", "contentscript.js")],
    authCallback: ['babel-polyfill', path.join(__dirname, "src", "auth-callback.js")],
    // inpage is responsible for injecting Web3 etc. It is designed to not need babel-polyfill, and adding it
    // as an entrypoint messes up with the websites that inject it as well:
    inpage: path.join(__dirname, "src", "inpage.js"),
  },
  chromeExtensionBoilerplate: {
    notHotReload: [
      "contentscript",
      "inpage",
    ],
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: `transform-loader?brfs`,
        include: /node_modules\/(bindings|metamask-crx)/
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader",
        exclude: /node_modules/
      },
      {
        test: new RegExp('\.(' + fileExtensions.join('|') + ')$'),
        loader: "file-loader?name=[name].[ext]",
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        loader: "html-loader",
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        exclude: (resource) => {
          // This regex matches paths containing "node_modules" or "bower_components",
          // EXCEPT the ones that also contain "metamask-crx":
          // see: https://stackoverflow.com/a/2404330/
          const ignoredPaths = /^(?!.*(metamask-crx|obs-store)).*(node_modules|bower_components)/

          // Use this regexp to ignore some metamask dependencies that are already compiled
          // and would break babel trying to act on them
          // This regex allows to match some paths that were not matched by the previous one (e.g subpaths
          // of metamask-crx although metamask-crx is not matched by ignoredPaths)
          // XXX could we do /metamask-crx\/.+(node_modules)/ to compile only metamask source file but not its
          // transitive dependencies?
          // const ignoredMetamaskDependencies = /metamask-crx\/.+(ethjs-query)/;
          const ignoredMetamaskDependencies = /metamask-crx\/node_modules/;

          return ignoredMetamaskDependencies.test(resource) || ignoredPaths.test(resource);
        },
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-env', 'babel-preset-react', 'babel-preset-stage-0'],
          }
        }
      }
    ]
  },
  node: {
    net: 'empty',
    fs: 'empty',
  },
  resolve: {
    // Support absolute imports from src/bettermask (e.g `import Assets from 'pages/assets'`)
    modules: ['node_modules', path.resolve(__dirname, './src/bettermask')],
    alias: alias,
  },
  plugins: [
    // clean the build folder
    new CleanWebpackPlugin(["build"]),
    // expose and write the allowed env vars on the compiled bundle
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV),
      "process.env.METAMASK_DEBUG": JSON.stringify(env.METAMASK_DEBUG),
      "process.env.BACKEND_URL": JSON.stringify(env.BACKEND_URL),
      "process.env.OAUTH_CLIENT_ID": JSON.stringify(env.OAUTH_CLIENT_ID),
      "process.env.OAUTH_REDIRECT_URI": JSON.stringify(env.OAUTH_REDIRECT_URI),
    }),
    new CopyWebpackPlugin([{
      from: "src/manifest.json",
      transform: function (content, path) {
        // generates the manifest file using the package.json informations
        return Buffer.from(JSON.stringify({
          description: process.env.npm_package_description,
          version: process.env.npm_package_version,
          ...JSON.parse(content.toString())
        }))
      }
    }]),
    // TODO move _locales and images inside static and get rid of the two following blocks:
    new CopyWebpackPlugin([{
      from: "_locales",
      to: "_locales",
      toType: 'dir',
    }]),
    new CopyWebpackPlugin([{
      from: "images",
      to: "images",
      toType: 'dir',
    }]),
    new CopyWebpackPlugin([{
      from: "static",
    }]),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "popup.html"),
      filename: "popup.html",
      chunks: ["popup"]
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "home.html"),
      filename: "home.html",
      chunks: ["popup"]
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "notification.html"),
      filename: "notification.html",
      chunks: ["popup"]
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "background.html"),
      filename: "background.html",
      chunks: ["background"]
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "auth-callback.html"),
      filename: "auth-callback.html",
      chunks: ["authCallback"]
    }),
    new WriteFilePlugin()
  ]
};

if (env.NODE_ENV === "development") {
  options.devtool = "eval";
}

module.exports = options;
