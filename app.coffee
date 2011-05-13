connect = require 'connect'
meryl = require 'meryl'
coffeekup = require 'coffeekup'

meryl
  .p(connect.static('public'))
  .get '/', (req, resp) ->
    resp.render 'layout',
      content: 'index'

  .options = {
    templateExt: '.coffee'
    templateFunc: coffeekup.adapters.meryl
    templateDir: 'views'
  }

meryl.run(port: Number(process.env.VMC_APP_PORT) || 8000)

