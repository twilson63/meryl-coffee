Meryl
=====

Meryl is a minimalist web framework for nodejs platform.
It is really simple to use, fun to play and easy to modify.

Here is simple preview.

	// take the pills
	var meryl = require('meryl');
	
	// first, take it easy
	meryl.handle('GET /', function (req, resp) {
		resp.end('<h3>Hello, World!</h3>');
	});
	
	// not impressed? let it interfere with blood some more
	meryl.handle('GET /greet/{who}', function(req, resp) {
		resp.render('greeter_template', {name: req.params.who});
	});
	
	// lay down and enjoy it
	meryl.plug('GET *', function(req, resp, next) {
		resp.setHeader('server', 'meryl');
		next();
	});
  
	// now you are a 'meryl' junkie
	meryl.run();


Meryl has much more.

Please visit wiki page for documentation:
  <http://github.com/coffeemate/meryl/wiki>

Also there are plenty of examples in 'examples' directory:
  <http://github.com/coffeemate/meryl/tree/master/examples>

For updates please follow:
  <http://twitter.com/meryljs>

Contributors:

 * Kadir Pekel (Author) <http://twitter.com/kadirpekel>
 * George Stagas <http://twitter.com/stagas>
 * Samuel Morello <http://twitter.com/ouvanous>
