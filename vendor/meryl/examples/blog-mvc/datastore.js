var dirty = require('dirty');

var db = null;

exports.load = function(onLoad) {
  db = dirty('blog.db');
  
  db.on('load', function () {
    onLoad();
  });
};

exports.findPosts = function () {
  var posts = {};
  var postids = db.get('posts');
  for (var i in postids) {
    var postid = postids[i];
    posts[postid] = exports.findPost(postid);
  }
  return posts;
};

exports.findPost = function (postid) {
  var post = db.get(postid);
  if(post)
    post.comments = findComments(postid);
  return post
}

function findComments (postid) {
  var comments = {};
  var commentids = db.get('comments');
  for (var i in commentids) {
    var commentid = commentids[i];
    var comment = db.get(commentid);
    if (comment.postid == postid) {
      comments[commentid] = comment;
    }
  }
  return comments;
}
