const http = require("http");
const cookie = require("cookie");

http
	.createServer(function (req, res) {
		let cookies = {};

		// if (req.headers.cookie !== undefined)
		if (req.headers.cookie) cookies = cookie.parse(req.headers.cookie); // parse string to object.

		console.log(cookies.cookie1); // output : choco

		// set cookie
		res.writeHead(200, {
			"Set-Cookie": [
				"cookie1=choco", // session cookie
				"cookie2=strawberry",
				`Permanent=cookies; Max-Age=${60 * 60 * 24 * 30}`, // permanent cookie with max valid number of seconds
			],
		});
		res.end("Cookie Test");
	})
	.listen(3000);
