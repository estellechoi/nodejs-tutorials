const db = require("./db");
const template = require("./template");
const qs = require("querystring");

exports.signin = (req, res, queryData, pathname) => {
	const title = "Sign In";
	const html = template.getHTML(
		title,
		"",
		`
            <form action="/signin_process" method="post">
                <p>
                    <input type="text" name="email" placeholder="Email"/>
                </p>
                <p>
                    <input type="password" name="password" placeholder="Password"/>
                </p>
                <p>
                    <input type="submit" Value="Sign In"/>
                </p>            
            </form>
            `,
		"",
		pathname
	);
	res.writeHead(200);
	res.end(html);
};

// setting cookie
exports.signinProcess = (req, res, queryData, path) => {
	let body = "";
	req.on("data", (data) => {
		body += data;
		if (body.length > 1e6) req.connection.destroy();
	});

	req.on("end", () => {
		const postData = qs.parse(body);
		const email = postData.email;
		const password = postData.password;
		if (email === "estele.choi@gmail.com" && password === "1111") {
			res.writeHead(302, {
				"Set-Cookie": [
					`sessionId=${email.split("")[1]}${password.split("")[1]}O${
						email.split("")[0]
					}${password.split("")[0]}`,
				],
				Location: `/`,
			});
			res.end();
		} else {
			res.writeHead(302, {
				Location: `/`,
			});
			res.end();
		}
	});
};

// killing cookie
exports.signoutProcess = (req, res, queryData, path) => {
	res.writeHead(302, {
		"Set-Cookie": [`sessionId=; Max-Age=0`], // if Max-Age <= 0, it simply means just kill the cookie right now.
		Location: `/`,
	});
	res.end();
};
