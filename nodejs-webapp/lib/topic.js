// module.exports = moduleName; 1 개의 모듈을 export
// exports.moduleName = ...; 여러 개의 모듈을 exports 객체에 담아서 export ?

// modules
const qs = require("querystring");
const path = require("path");
const connection = require("./db");
const template = require("./template");
const sanitizeHtml = require("sanitize-html"); // remove dangerous scripting part user created.
const cookie = require("cookie");

// check if the client has cookie named sessionId
function checkSessionId(req) {
	let hasSession = false;
	let cookies = {};
	if (req.headers.cookie) cookies = cookie.parse(req.headers.cookie);
	if (cookies.sessionId && cookies.sessionId === "s1Oe1") hasSession = true;

	return hasSession;
}

exports.home = function (req, response, queryData) {
	connection.query(`SELECT * FROM topic`, (err, results) => {
		if (err) throw err; // if error occurs, console prints the error and this app stops.

		const hasSession = checkSessionId(req);
		const uiByAuth = hasSession ? `<a href="/create">create</a>` : "";

		const title = "Welcome";
		const data = "Hello node.js";
		const list = template.getList(results); // results is an array of objects.
		const html = template.getHTML(
			title,
			list,
			`<h2>${title}</h2><p>${data}</p>`,
			uiByAuth,
			"",
			hasSession
		);
		response.writeHead(200);
		response.end(html);
	});
};

exports.page = function (req, response, queryData) {
	connection.query(`SELECT * FROM topic`, (err, topics) => {
		if (err) throw err;
		// using ? in sql query blocks possible hacking attempts.
		connection.query(
			`SELECT * FROM topic LEFT JOIN author ON topic.author_id = author.id WHERE topic.id = ?`,
			[queryData.id],
			(err, results) => {
				if (err) throw err;
				if (!results.length) return response.writeHead(200);

				const title = results[0].title;
				const data = results[0].description;
				const author = results[0].name ? results[0].name : "Anonymous user";

				const list = template.getList(topics);

				const hasSession = checkSessionId(req);

				const html = template.getHTML(
					title,
					list,
					`<h2>${sanitizeHtml(title)}</h2>
                    <p class="sub_info">Author: ${sanitizeHtml(author)}</p>
                    <p class="para">${sanitizeHtml(data)}</p>`,
					`<a href="/create">create</a>
                        <a href="/update?id=${queryData.id}">update</a>
                        <form action="/delete_process" method="post">
                            <input type="hidden" name="id" value="${queryData.id}">
                            <input type="submit" value="delete">
						</form>`,
					"",
					hasSession
				);
				response.writeHead(200);
				response.end(html);
			}
		);
	});
};

exports.create = function (req, response, queryData) {
	connection.query(`SELECT * FROM topic`, (err, topics) => {
		if (err) throw err;

		const title = "<div>Create</div>";
		console.log(title);
		const list = template.getList(topics);

		const hasSession = checkSessionId(req);

		const html = template.getHTML(
			title,
			list,
			`
            <form action="/create_process" method="post">
                <input type="text" name="name" placeholder="User name"><br>
                <input type="text" name="profile" placeholder="Introduce yourself."><br>
                <input type="text" name="title" placeholder="Title"><br>
                <textarea name="description" placeholder="Description"></textarea><br>
                <input type="submit" value="ok"><br>
            </form>
            `,
			title,
			"",
			hasSession
		);
		response.writeHead(200); // 응답코드
		response.end(html); // template 을 응답
	});
};

exports.createProcess = function (req, response, queryData) {
	// * POST 전송 데이터를 수신하는 이벤트
	// POST 전송 데이터가 매우 많은 경우를 대비하여 데이터의 일부를 수신할 때마다 콜백함수를 호출하여 데이터를 저장한다.
	let body = "";
	req.on("data", (data) => {
		body += data;
		// if too much POST data, kill the connection. (for security)
		// 1e6 : Math.pow(10, 6) === 1 * 1000000 ~ 1MB
		if (body.length > 1e6) {
			req.connection.destroy();
		}
	});

	// on end of sending req data
	req.on("end", () => {
		// 수신한 POST 데이터 객체
		const postData = qs.parse(body);
		const title = postData.title; // encodeURI vs qs.escape() ?
		const titleFiltered = path.parse(title).base;
		const description = postData.description;

		const name = postData.name;
		const profile = postData.profile;
		if (name && name.length) {
			connection.query(
				`INSERT INTO author (name, profile) VALUES (?, ?)`,
				[name, profile],
				(err) => {
					if (err) throw err;

					connection.query(
						`SELECT id FROM author WHERE name = ? and profile = ?`,
						[name, profile],
						(err, results) => {
							if (err) throw err;
							if (!results.length)
								return response.writeHead(302, {
									Location: `/create`,
								});

							const userId = results[0].id;

							connection.query(
								`INSERT INTO topic (title, description, created, author_id) VALUES (?, ?, NOW(), ?)`,
								[titleFiltered, description, userId],
								(err, results) => {
									if (err) throw err;

									response.writeHead(302, {
										Location: `/?id=${results.insertId}`,
									});
									response.end();
								}
							);
						}
					);
				}
			);
		}
	});
};

exports.update = function (req, response, queryData) {
	connection.query(`SELECT * FROM topic`, (err, topics) => {
		if (err) throw err;

		const idFiltered = path.parse(queryData.id).base;
		connection.query(
			`SELECT * FROM topic WHERE id = ?`,
			[idFiltered],
			(error, results) => {
				if (error) throw error;

				if (results.length) {
					const res = results[0];
					const title = res.title;
					const data = res.description;
					const list = template.getList(topics);

					const hasSession = checkSessionId(req);

					const html = template.getHTML(
						title,
						list,
						`
                        <form action="/update_process" method="post">
                            <input type="hidden" name="id" value="${res.id}">
                            <input type="text" name="title" placeholder="title" value="${title}"><br>
                            <textarea name="description" placeholder="description">${data}</textarea><br>
                            <input type="submit" value="ok"><br>
                        </form>
                        `,
						"Update",
						"",
						hasSession
					);
					response.writeHead(200); // 응답코드
					response.end(html); // template 을 응답
					return;
				}
				response.writeHead(200); // 응답코드
			}
		);
	});
};

exports.updateProcess = function (req, response, queryData) {
	let body = "";
	req.on("data", function (data) {
		body += data;
	});
	req.on("end", function () {
		// 수신한 POST 데이터를 담은 객체를 반환
		const postData = qs.parse(body);
		const id = postData.id;
		const title = postData.title;
		const description = postData.description;
		const idFiltered = path.parse(id).base;
		const titleFiltered = path.parse(title).base;

		connection.query(
			`UPDATE topic SET title = ?, description = ? WHERE id = ?`,
			[titleFiltered, description, idFiltered],
			(err) => {
				if (err) throw err;

				response.writeHead(302, {
					Location: `/?id=${idFiltered}`,
				});
				response.end();
			}
		);
	});
};

exports.deleteProcess = function (req, response, queryData) {
	let body = "";
	req.on("data", function (data) {
		body += data;
	});
	req.on("end", function () {
		const postData = qs.parse(body);
		const id = postData.id;
		const idFiltered = path.parse(id).base; // 요청 id 필터링 (보안처리)

		connection.query(`DELETE FROM topic WHERE id = ?`, [idFiltered], (err) => {
			if (err) throw err;
			response.writeHead(302, { Location: `/` });
			response.end();
		});
	});
};
