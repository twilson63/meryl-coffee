coffeekup = require 'coffeekup'
connect = require 'connect'

people = ['animal', 'beakers', 'piggy', 'kermit']

(require '../../index')

  .plug connect.logger(),
    connect.static(".")

  .get '/', (req, resp) ->
    resp.redirect('/people')

  .get '/people', (req, resp) ->
    resp.render 'layout',
      content: 'list'
      context:
        people: people

  .get '/people/{personid}', (req, resp) ->
    resp.render 'layout',
      content: 'show'
      context:
        person: people[req.params.personid]

  .run
    templateExt: '.coffee'
    templateFunc: coffeekup.adapters.meryl

  console.log 'listening...'
