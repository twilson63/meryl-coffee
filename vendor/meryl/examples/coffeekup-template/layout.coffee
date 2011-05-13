html ->
  head ->
    title 'coffeekup demo'
  body ->
    div id: 'header', ->
      img src: '/coffeescript.png'
      h3 'Muppet Crew'
    div id: 'wrap',
      -> @render @content, @context
    div id: 'header', ->
      p 'Powered with Meryl!'
