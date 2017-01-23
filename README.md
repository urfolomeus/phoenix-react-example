# Phoenix React Example

This is an example of how to set up a Phoenix and React project. We'll start with a basic umbrella mix app and build from there. Technologies and the versions that this example uses are below.


## Technologies

### Languages

See the project's **.tool-versions** file.

### Frameworks

* Phoenix -> see the frontend app's **mix.exs** file.
* React -> see the frontend app's **package.json** file.

### Libraries

* See each app's **mix.exs** file for Elixir libraries.
* See the frontend app's **package.json** for JavaScript libraries.


## Instructions

Please note that I've marked the commits with **COMMIT n** so that you can check the codebase if you need to.

### Base umbrella app

1. Navigate to the folder where you want to place the project and type:

    ```shell
    mix new --umbrella <project_name>
    cd <project_name>
    ```

1. At this point you'll probably want to start a README for the project and initialize git. If you're using [asdf](https://github.com/asdf-vm/asdf) to manage your versions, you can set this up now too.

    ```shell
    $EDITOR ./README.md
    git init
    asdf local elixir <version>
    asdf local erlang <version>
    asdf local nodejs <version>
    ```

1. **COMMIT 1**

### Adding Phoenix

1. We'll now add a Phoenix app. Note that we're not using Ecto (we'll use a separate app to manage persistence) or Brunch (we'll be using Webpack instead).

    ```shell
    cd apps
    mix phoenix.new --no-ecto --no-brunch <frontend_app_name>
    ```
1. **COMMIT 2**

### Adding webpack

1. Now we'll add Webpack, but before we can do that we need to initialize our application for npm.

    ```shell
    cd apps/<frontend_app_name>
    npm init # and follow the prompts
    ```

1. We're going to use Webpack 2, so for the time being we'll need to specify the version. Check [the Webpack GitHub repo](https://github.com/webpack/webpack) for the latest stable version. We're going to use **2.2.0** here.

    ```shell
    npm i -D webpack@2.2.0
    ```

1. If you do a `git status` now you'll see that we get a load of **node_modules** files. Let's set up the local **.gitignore** to ignore unwanted JavaScript files.

    ```shell
    # <project_name>/apps/<frontend_app_name>/.gitignore
    ...
    # Static artifacts
    /node_modules
    npm-debug.log*

    # Since we are building assets from web/static,
    # we ignore priv/static. You may want to comment
    # this depending on your deployment strategy.
    /priv/static/
    ...
    ```

1. Now we need to setup webpack so that it will automatically build our assets when we make any changes to them. We'll start by adding a **webpack.config.js** file to the root of the frontend app. We're going to make the entry to our React app **web/static/index.js** even though Phoenix normall makes the root **web/static/app.js**. This is personal preference as we discovered that the app.js file ends up being the natural place to do all the app setup, whereas we just want index.js to be the leaping off point. We'll still call the build file in **priv/static/js** app.js because when concatenated that is our entire app. Feel free to change this though if you'd prefer.

    ```JavaScript
    var path = require('path');

    module.exports = {
      entry: './web/static/js/index.js',
      output: {
        path: path.join(__dirname, 'priv', 'static', 'js'),
        filename: 'app.js'
      }
    };

    ```

1. Then we can create a script to start our webpack watcher in **package.json**

    ```json
    ...
    "scripts": {
      "start": "webpack --watch-stdin --progress --color"
    }
    ...
    ```

1. And then call it from **config/dev.exs** in the watchers section

    ```elixir
    #...
      watchers: [npm: ["run", "start"]]
    #...
    ```

1. Finally we need to have a **web/static/js/index.js** file, because that's where we told webpack we'd have the entry point to our application.

    ```JavaScript
    console.log('Webpack is working')
    ```
1. If we start up our server (`mix phoenix.server`), visit <http://localhost:4000> and then open the console we should see "Webpack is working".

1. COMMIT 3

### Adding Babel

1. In order to use the built-in Phoenix JavaScript, and just to have a more pleasant coding experience, we'll use Babel to transpile ES6 JavaScript into ES5 JavaScript. We'll start by installing the required libraries from npm. Check that your still in the root of your frontend project app and then:

    ```shell
    npm i -D babel-core babel-loader babel-preset-env
    ```

1. Now we need to wire up webpack to use Babel. In **webpack.config.js**

    ```JavaScript
    var path = require('path');

    module.exports = {
      entry: './web/static/js/index.js',
      output: {
        path: path.join(__dirname, 'priv', 'static', 'js'),
        filename: 'app.js'
      },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            use: 'babel-loader',
            exclude: /node_modules/
          }
        ]
      },
      resolve: {
        modules: [ 'node_modules', __dirname + '/web/static/js' ]
      }
    };

    ```

1. We can complete this step by adding a **.babelrc** file to the root of the frontend app with the following:

    ```json
    {
      "presets": ["babel-preset-env"]
    }
    ```

1. Check that everything has gone as planned by changed **web/static/app.js** to the following and then checking your browser console again.

    ```JavaScript
    const test = () => console.log('Webpack is working with Babel')
    test()
    ```

1. COMMIT 4

### Adding CSS Processing

1. Now let's setup webpack to post process our CSS for us. Typically in a React project you keep the CSS files alongside the code files, so we'll stick with this convention. However, rather than have the styles added to the HTML file in a style tag as is typically done in development React apps, we'll build to **priv/static** as that's what is normally done in a Phoenix app. Feel free to change this in you app if you prefer. Let's start by installing the necesarry libraries (note that we need to specify the version for extract-text-webpack-plugin).

    ```shell
    npm i -D css-loader style-loader extract-text-webpack-plugin@2.0.0-beta.5
    ```

1. Now update the **webpack.config.js** file as follow:

    ```JavaScript
    var ExtractTextPlugin = require('extract-text-webpack-plugin');
    var path = require('path');

    module.exports = {
      entry: './web/static/js/index.js',
      output: {
        path: path.join(__dirname, 'priv', 'static', 'js'),
        filename: 'app.js'
      },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            use: 'babel-loader',
            exclude: /node_modules/
          },
          {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract({
              fallbackLoader: 'style-loader',
              loader: 'css-loader'
            })
          }
        ]
      },
      plugins: [
        new ExtractTextPlugin('../css/app.css')
      ],
      resolve: {
        modules: [ 'node_modules', __dirname + '/web/static/js' ]
      }
    };
    ```

    We add in a require for the ExtractTextPlugin and then use that in a new **plugins** section to generate a CSS file in **priv/static/css/app.css**.
    Then we add a new rule to the **module** section that matches on files ending .css anywhere in our **web/static/js** folder and runs them through first the css-loader and then the style-loader, finally handing off to the ExtractTextPlugin loader.

1. Let's now actually output something on the screen so that we can tell if we have everything wired up correctly. We'll start by deleting what's currently being shown. Change **web/templates/layouts/app.html.eex** as follows:

    ```html
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="">
        <meta name="author" content="">

        <title>Hello Frontend!</title>
        <link rel="stylesheet" href="<%= static_path(@conn, "/css/app.css") %>">
      </head>

      <body>
        <%= render @view_module, @view_template, assigns %>
        <script src="<%= static_path(@conn, "/js/app.js") %>"></script>
      </body>
    </html>
    ```

    And then change **web/templates/page/index.html.eex** to the following:

    ```html
    <div class="root">App goes here</div>
    ```

1. We'll now create the skeleton for our React app. In **web/static/js** add a folder called **app** and then add the following files to it.

    **app.css**

    ```css
    .root {
      color: red;
    }
    ```

    **app.js**

    ```JavaScript
    import './app.css'
    ```

1. And change **web/static/js/index.js** to the following:

    ```JavaScript
    import './app/app'
    ```

1. If you refresh your browser you should now see the text "App goes here" in red.

1. We've not setup any special post processing rules here, but you might want to consider autoprefixing and possibly also CSS Modules.

1. COMMIT 5

### Adding image support

1. React has a different way of handling images. They are typically imported in to the component file thaat needs them and then attached to the image. One way that is becoming popular is to use a library like **image-webpack-loader** to determine based on the size of a file whether to generate a url to an image or whether to turn it into a blob and attach that as data to the image tag. We'll set this up in webpack, but first we need the libraries.

    ```shell
    npm i -D image-webpack-loader url-loader
    ```

1. Now open **webpack.config.js** and change it to the following:

    ```JavaScript
    var ExtractTextPlugin = require('extract-text-webpack-plugin');
    var path = require('path');

    module.exports = {
      entry: './web/static/js/index.js',
      output: {
        path: path.join(__dirname, 'priv', 'static', 'js'),
        filename: 'app.js',
        publicPath: 'priv/static'
      },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            use: 'babel-loader',
            exclude: /node_modules/
          },
          {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract({
              fallbackLoader: 'style-loader',
              loader: 'css-loader'
            })
          },
          {
            test: /\.(jpe?g|png|gif|svg)$/,
            use: [
              {
                loader: 'url-loader',
                options: { limit: 40000 }
              },
              'image-webpack-loader'
            ]
          }
        ]
      },
      plugins: [
        new ExtractTextPlugin('../css/app.css')
      ],
      resolve: {
        modules: [ 'node_modules', __dirname + '/web/static/js' ]
      }
    };
    ```

    We've added another rule, this time to match on image file extensions and use the url and image-webpack loaders to either attach the image as data if it's 40kb or under or as a url. We also had to a **publicPath** key to our **output** section so that webpack knows where to place any image file that we need.

1. Let's test what we've built. Move the **phoenix.png** file from **priv/static/images** into **web/static/assets/images** (you may need to create the latter folder if you created your folder without Brunch).

1. Now open **web/static/js/app/app.js** and change it to the following:

    ```JavaScript
    import './app.css'

    import phoenix from '../../assets/images/phoenix.png'

    const image = document.createElement('img')
    image.src = phoenix
    document.body.appendChild(image)
    ```

1. If you refresh your browser you should see that the Phoenix logo has been added to the page. If you look towards the bottom of the generated **priv/static/js/app.js** file you should see that the image was appended as data rather than as a URL because the file size is under 40kb.
