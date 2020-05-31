// modules of node.js (내장모듈)
var http = require("http");
var url = require("url");
var qs = require("querystring");
var path = require("path");

// module self-made
var template = require("./lib/template.js");
var connection = require("./lib/db.js");

// * http.createServer(requestListener); http.Server 객체를 반환한다.
// * The requestListener is a function which is automatically added to the 'request' event.
// -> 웹어플리케이션 접속시마다 createServer의 콜백함수가 호출된다.
var app = http.createServer(function (request, response) {
	var _url = request.url; // 사용자 요청에서 url을 반환
	console.log(url.parse(_url, true)); // 해당 url을 파싱하여 객체를 반환

	var queryData = url.parse(_url, true).query; // query String 정보를 담은 객체 반환
	var pathname = url.parse(_url, true).pathname; // queryString 제외한 path 반환

	if (pathname === "/") {
		if (queryData.id === undefined) {
			connection.query(`SELECT * FROM topic`, (err, results) => {
				if (err) throw err; // if error occurs, console prints the error and this app stops.

				const title = "Welcome";
				const data = "Hello node.js";
				const list = template.getList(results); // results is an array of objects.
				const html = template.getHTML(
					title,
					list,
					`<h2>${title}</h2><p>${data}</p>`,
					`<a href="/create">create</a>`
				);
				response.writeHead(200);
				response.end(html);
			});
		} else {
			connection.query(`SELECT * FROM topic`, (err, topics) => {
				if (err) throw err;
				// using ? in sql query blocks possible hacking attempts.
				connection.query(
					`SELECT * FROM topic WHERE id = ?`,
					[queryData.id],
					(err, results) => {
						if (err) throw err;
						// console.log(results);

						if (results.length) {
							const res = results[0];
							const title = res.title;
							const data = res.description;

							const list = template.getList(topics);
							const html = template.getHTML(
								title,
								list,
								`<h2>${title}</h2><p>${data}</p>`,
								`<a href="/create">create</a>
							 <a href="/update?id=${queryData.id}">update</a>
							 <form action="/delete_process" method="post">
								 <input type="hidden" name="id" value="${queryData.id}">
								<input type="submit" value="delete">
							 </form>`
							);
							response.writeHead(200);
							response.end(html);
							return;
						}
						response.writeHead(200);
					}
				);
			});
		}
	} else if (pathname === "/create") {
		connection.query(`SELECT * FROM topic`, (err, topics) => {
			if (err) throw err;

			const title = "Create";
			console.log(title);
			const list = template.getList(topics);
			const html = template.getHTML(
				title,
				list,
				`
				<form action="/create_process" method="post">
					<input type="text" name="title" placeholder="title"><br>
					<textarea name="description" placeholder="description"></textarea><br>
					<input type="submit" value="ok"><br>
				</form>
				`,
				title
			);
			response.writeHead(200); // 응답코드
			response.end(html); // template 을 응답
		});
	} else if (pathname === "/create_process") {
		// * POST 전송 데이터를 수신하는 이벤트
		// POST 전송 데이터가 매우 많은 경우를 대비하여 데이터의 일부를 수신할 때마다 콜백함수를 호출하여 데이터를 저장한다.
		let body = "";
		request.on("data", (data) => {
			body += data;
			// if too much POST data, kill the connection. (for security)
			// 1e6 : Math.pow(10, 6) === 1 * 1000000 ~ 1MB
			if (body.length > 1e6) {
				request.connection.destroy();
			}
		});

		// on end of sending request data
		request.on("end", () => {
			// 수신한 POST 데이터 객체
			const postData = qs.parse(body);
			console.log(postData);

			const title = postData.title; // encodeURI vs qs.escape() ?
			const titleFiltered = path.parse(title).base;
			const description = postData.description;
			connection.query(
				`INSERT INTO topic (title, description, created, author_id) VALUES (?, ?, NOW(), ?)`,
				[titleFiltered, description, 1],
				(err, results) => {
					if (err) throw err;

					response.writeHead(302, {
						Location: `/?id=${results.insertId}`,
					});
					response.end();
				}
			);
		});
	} else if (pathname === "/update") {
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
							"Update"
						);
						response.writeHead(200); // 응답코드
						response.end(html); // template 을 응답
						return;
					}
					response.writeHead(200); // 응답코드
				}
			);
		});
	} else if (pathname === "/update_process") {
		let body = "";
		request.on("data", function (data) {
			body += data;
		});
		request.on("end", function () {
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
	} else if (pathname === "/delete_process") {
		let body = "";
		request.on("data", function (data) {
			body += data;
		});
		request.on("end", function () {
			const postData = qs.parse(body);
			const id = postData.id;
			const idFiltered = path.parse(id).base; // 요청 id 필터링 (보안처리)

			connection.query(
				`DELETE FROM topic WHERE id = ?`,
				[idFiltered],
				(err) => {
					if (err) throw err;
					response.writeHead(302, { Location: `/` });
					response.end();
				}
			);
		});
	} else {
		response.writeHead(404);
		response.end("Not found");
	}
});

// * http.Server.listen(); starts the HTTP server listening for connections. (서버 구동)
// port: 3000
// 웹서버 포트의 기본값은 80 (url 에서 생략 가능)
app.listen(3000);
