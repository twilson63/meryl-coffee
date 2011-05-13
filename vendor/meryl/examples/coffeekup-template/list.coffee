ul ->
  for name, index in @people
    li -> 
      a href: "/people/#{index}", -> name
