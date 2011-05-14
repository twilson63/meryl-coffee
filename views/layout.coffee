doctype 5
html ->
  head ->
    meta charset: 'utf-8'

    title "#{@context.title} | My Site" if @context.title?
    meta(name: 'description', content: @context.description) if @context.description?
    link(rel: 'canonical', href: @context.canonical) if @context.canonical?

    link rel: 'icon', href: '/favicon.png'

    script src: 'http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js'

    coffeescript ->
      $ ->
        alert 'hi!'

    style '''
      header, nav, section, article, aside, footer {display: block}
      nav li {display: inline; margin:10px}
      nav.sub {float: right}
      #content {margin-left: 120px}
    '''
  body ->
    @render @content, @context