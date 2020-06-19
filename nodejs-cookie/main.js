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
				"cookie3=orange; Secure", // this cookie disabled when http connection, not https.
				"cookie4=milk; HttpOnly", // cannot access this cookie using javaScript like document.cookie
				"cookie5=coke; Path=/coke", // limit the range of this cookie beneath the path '/coke'.
				"cookie6=apple; Domain=o2.io", // limit the range of this cookie for the domain of '*.o2.io'.
			],
		});
		res.end("Cookie Test");
	})
	.listen(3000);
