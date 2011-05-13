with (meryl) {

  get('/posts/{postid}/comments/{commentid}', function(req, resp) {
    var post = datastore.findPost(req.params.postid);
    resp.render('layout/main', {content: 'comment/show', context: {post: post}});
  });
 
  get('/posts/{postid}/comments', function(req, resp) {
    var post = datastore.findPost(req.params.postid);
    resp.render('layout/main', {content: 'comment/list', context: {post: post}});
  });
}

