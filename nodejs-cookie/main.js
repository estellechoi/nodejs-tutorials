const http = require("http");
const cookie = require("cookie");

http
	.createServer(function (req, res) {
		let cookie = {};

		// if (req.headers.cookie !== undefined)
		if (req.headers.cookie) cookie = cookie.parse(req.headers.cookie); // parse string to object.

		console.log(cookie.cookie1); // output : choco

		// set cookie
		res.writeHead(200, {
			"Set-Cookie": ["cookie1=choco", "cookie2=strawberry"],
		});
		res.end("Cookie Test");
	})
	.listen(3000);
