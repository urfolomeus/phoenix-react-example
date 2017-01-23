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
1. We'll now add a Phoenix app. Note that we're not using Ecto (we'll use a separate app to manage persistence) or Brunch (we'll be using Webpack instead).

    ```shell
    cd apps
    mix phoenix.new --no-ecto --no-brunch <frontend_app_name>
    ```
1. **COMMIT 2**
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
