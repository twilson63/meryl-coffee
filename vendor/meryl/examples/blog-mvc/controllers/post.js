with (meryl) {

  get('/posts', function(req, resp) {
    var posts = datastore.findPosts();
    resp.render('layout/main', {content: 'post/list', context: {posts: posts}});
  });
 
  get('/posts/{postid}', function(req, resp) {
    var post = datastore.findPost(req.params.postid);
    resp.render('layout/main', {content: 'post/show', context: {post: post }});
  });
}

