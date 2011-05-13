# Meryl Coffee 

A Skeleton Template to get started fast with AWESOME NodeJs and CoffeeScript
development.

## Setup

Install nodejs and npm:

see [nodejs](http://nodejs.com)

```
npm install coffee-script
npm install connect
npm install meryl
npm install mime
npm install qs
npm install coffeekup

git clone http://github.com/twilson63/meryl-coffee.git

```
## Run the server

```
coffee app.coffee

or

node app.js

```
## Usage

Once you have the app running, just start creating your routes in
app.coffee

``` coffee
# app.coffee
.get '/about', (req, resp) ->
  resp.render 'layout',
    content: 'about'

# views/about.coffee
h1 'About Page'
```

## Thanks

* NodeJs [nodejs](http://nodejs.org)
* CoffeeScript [coffeescript](http://coffeescript.org)
* CoffeeKup [coffeekup](http://coffeekup.org/)
* Meryl [meryl](https://github.com/coffeemate/meryl/wiki)

These technologies really work well together to create awesome web apps.

## Feedback

Help me keep this template up to date, either send a pull request or add an issue.


## Contribute

Feel free to send a pull request, if it makes sense, I will add it.



