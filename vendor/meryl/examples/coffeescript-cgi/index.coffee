# Type 'meryl' in current working directory
# Then fetch address 'http:localhost:3000'

sentence = ['Meryl', 'is', 'real', 'fun', 'with', 'coffeescript']
ul ->
for word in sentence
  li -> word

hr ->

a href:'/yetanotherkupof', -> 'Go to another page'

