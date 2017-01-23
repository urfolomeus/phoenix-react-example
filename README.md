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

1. Navigate to the folder where you want to place the project and type:

    ```shell
    mix new --umbrella <project_name>
    cd <project_name>
    ```

2. At this point you'll probably want to start a README for the project and initialize git. If you're using [asdf](https://github.com/asdf-vm/asdf) to manage your versions, you can set this up now too.

    ```shell
    $EDITOR ./README.md
    git init
    asdf local elixir <version>
    asdf local erlang <version>
    asdf local nodejs <version>
    ```

3. **COMMIT 1**
4. We'll now add a Phoenix app. Note that we're not using Ecto (we'll use a separate app to manage persistence) or Brunch (we'll be using Webpack instead).

    ```shell
    cd apps
    mix phoenix.new --no-ecto --no-brunch <frontend_app_name>
    ```
5. **COMMIT 2**
