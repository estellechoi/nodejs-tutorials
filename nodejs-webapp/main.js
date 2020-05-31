// modules of node.js (내장모듈)
var http = require("http");
var fs = require("fs");
var url = require("url");
var qs = require("querystring");
var path = require("path");

// module self-made
var template = require("./lib/template.js");

// modules installed using NPM (node_modules 디렉토리에서 일치하는 모듈을 탐색해서 가져온다.)
var sanitizeHtml = require("sanitize-html");
var mysql = require("mysql");

// connecting to mysql server
var connection = mysql.createConnection({
	host: "localhost",
	user: "temp_user",
	password: "yk0425",
	database: "board_node",
});

connection.connect();

// * http.createServer(requestListener); http.Server 객체를 반환한다.
// * The requestListener is a function which is automatically added to the 'request' event.
// -> 웹어플리케이션 접속이 발새할 때마다 createServer의 콜백함수가 호출된다.
var app = http.createServer(function (request, response) {
	var _url = request.url; // 사용자 요청에서 url을 반환
	console.log(url.parse(_url, true)); // 해당 url을 파싱하여 객체를 반환

	var queryData = url.parse(_url, true).query; // query String 정보를 담은 객체 반환
	var pathname = url.parse(_url, true).pathname; // queryString 제외한 path 반환

	if (pathname === "/") {
		// queryString 이 없을 때 (홈 화면)
		if (queryData.id === undefined) {
			// fs.readdir(); 폴더의 파일 목록을 가져오기 (파일명) - 비동기 메소드이다.
			// fs.readdir("./data", function (err, fileList) {
			// 	var title = "Welcome";
			// 	var data = "Hello node.js";
			// 	var list = template.getList(fileList);
			// 	var html = template.getHTML(
			// 		title,
			// 		list,
			// 		`<h2>${title}</h2><p>${data}</p>`,
			// 		`<a href="/create">create</a>`
			// 	);
			// 	response.writeHead(200); // 응답코드
			// 	response.end(html); // template 을 응답
			// });
			connection.query(`SELECT * FROM topic`, function (err, results) {
				if (err) {
					console.log(err);
					throw err;
				}

				const title = "Welcome";
				const data = "Hello node.js";

				// results is an array of objects.
				const list = template.getList(results);
				const html = template.getHTML(
					title,
					list,
					`<h2>${title}</h2><p>${data}</p>`,
					`<a href="/create">create</a>`
				);
				response.writeHead(200);
				response.end(html);
			});
		}
		// queryString 있을 때
		else {
			fs.readdir("./data", function (err, fileList) {
				// *** 입력 관련 보안장치 (사용자가 중요파일에 접근하지 못하도록)
				// * path.parse(path); URL(요청경로)을 파싱하여 경로정보를 담은 객체 반환
				// * base 속성의 값: 경로를 제외한 파일명
				// ../ 와 같은 디렉토리 탐색이 가능한 요청을 제거하도록 필터링
				var idFiltered = path.parse(queryData.id).base;

				// fs.readFile(); 파일 내용 읽어오기
				fs.readFile(`data/${idFiltered}`, "UTF-8", function (err, data) {
					var title = queryData.id;
					var list = template.getList(fileList);

					// *** 출력 관련 보안장치 (위험한 입력값이 html 태그로서 동작하지 못하도록 ex) <script>)
					// * sanitize-html 모듈을 사용하여 html태그를 없앤 문자열을 반환한다.
					// 파라미터를 사용하여 허용되는 html 태그를 설정할 수 있다.
					var titleSani = sanitizeHtml(title);
					var dataSani = sanitizeHtml(data, {
						allowedTags: ["h1"],
					});

					// delete 기능은 보안상의 이유로 GET 방식으로 하면 안된다. (삭제 URL이 외부에 노출되면 누구나 삭제가 가능할 수 있기 때문)
					var html = template.getHTML(
						titleSani,
						list,
						`<h2>${titleSani}</h2><p>${dataSani}</p>`,
						`<a href="/create">create</a>
						 <a href="/update?id=${qs.escape(titleSani)}">update</a>
						 <form action="/delete_process" method="post">
						 	<input type="hidden" name="id" value="${titleSani}">
							<input type="submit" value="delete">
						 </form>`
					);
					// response.end(fs.readFileSync(__dirname + url));
					response.writeHead(200);
					response.end(html);
				});
			});
		}
	} else if (pathname === "/create") {
		fs.readdir("./data", function (err, fileList) {
			var title = "Create";
			var list = template.getList(fileList);
			var html = template.getHTML(
				title,
				list,
				`
				<form action="/create_process" method="post">
					<input type="text" name="title" placeholder="title"><br>
					<textarea name="description" placeholder="description"></textarea><br>
					<input type="submit" value="ok"><br>
				</form>
			`,
				""
			);
			response.writeHead(200); // 응답코드
			response.end(html); // template 을 응답
		});
	} else if (pathname === "/create_process") {
		// ** 각 이벤트 발생시 호출될 콜백함수를 작성
		// * POST 전송 데이터를 수신하는 이벤트
		// POST 전송 데이터가 매우 많은 경우를 대비하여 데이터의 일부를 수신할 때마다 콜백함수를 호출하여 데이터를 저장한다.
		var body = "";
		request.on("data", function (data) {
			body += data;
			// for too much POST data, kill the connection. (보안상)
			// 1e6 : Math.pow(10, 6) === 1 * 1000000 ~ 1MB
			if (body.length > 1e6) {
				request.connection.destroy();
			}
		});

		// * 더이상 수신되는 데이터가 없는 이벤트
		request.on("end", function () {
			// querystring 모듈의 메소드 사용
			// 수신한 POST 데이터를 담은 객체를 반환
			var postData = qs.parse(body);
			console.log(postData);
			var title = postData.title; // encodeURI vs qs.escape() ?
			var titleFiltered = path.parse(title).base;
			var description = postData.description;

			// * fs.writeFile(파일 경로, 파일 내용, 인코딩, 콜백함수); 파일을 작성한다. (파일 경로가 없다면 새 파일 생성)
			fs.writeFile(`data/${titleFiltered}`, description, "UTF-8", function (
				err
			) {
				// 콜백함수의 결과에 따라 수행될 내용은 비동기 메소드 안에 작성해야 ..
				// * redirect 코드 : 302
				// * qs.escape(); qs.unescape();
				// URL은 아스키코드로 이뤄져야하기 때문에 그 외의 문자는 “%”와 16진수 문자를 조합해 인코딩해야 한다. (escapte 처리)
				response.writeHead(302, {
					Location: `/?id=${qs.escape(titleFiltered)}`,
				});
				response.end();
			});
		});
	} else if (pathname === "/update") {
		fs.readdir("./data", function (err, fileList) {
			var idFiltered = path.parse(queryData.id).base;
			fs.readFile(`data/${idFiltered}`, "UTF-8", function (err, data) {
				var title = queryData.id;
				var list = template.getList(fileList);
				var html = template.getHTML(
					title,
					list,
					`
					<form action="/update_process" method="post">
						<input type="hidden" name="id" value="${title}">
						<input type="text" name="title" placeholder="title" value="${title}"><br>
						<textarea name="description" placeholder="description">${data}</textarea><br>
						<input type="submit" value="ok"><br>
					</form>
				`,
					""
				);
				response.writeHead(200); // 응답코드
				response.end(html); // template 을 응답
			});
		});
	} else if (pathname === "/update_process") {
		var body = "";
		request.on("data", function (data) {
			body += data;
		});
		request.on("end", function () {
			// 수신한 POST 데이터를 담은 객체를 반환
			var postData = qs.parse(body);
			var id = postData.id;
			var title = postData.title;
			var description = postData.description;
			var idFiltered = path.parse(id).base;
			var titleFiltered = path.parse(title).base;
			console.log(postData);
			// * fs.rename(old path, new path, callback); 파일명을 바꾼다.
			fs.rename(`data/${idFiltered}`, `data/${titleFiltered}`, function (err) {
				// * fs.writeFile(); 파일을 작성한다.
				fs.writeFile(`data/${titleFiltered}`, description, "UTF-8", function (
					err
				) {
					// * redirect 코드 : 302
					response.writeHead(302, {
						Location: `/?id=${qs.escape(titleFiltered)}`,
					});
					response.end();
				});
			});
		});
	} else if (pathname === "/delete_process") {
		var body = "";
		request.on("data", function (data) {
			body += data;
		});
		request.on("end", function () {
			var postData = qs.parse(body);
			var id = postData.id;
			var idFiltered = path.parse(id).base; // 요청 id 필터링 (보안처리)

			// fs.unlink(); 파일 또는 symbolic link를 삭제한다.
			fs.unlink(`data/${idFiltered}`, function (err) {
				response.writeHead(302, {
					Location: `/`,
				});
				response.end();
			});
		});
	}
	// pathname !== "/" (경로 오류)
	else {
		response.writeHead(404);
		response.end("Not found");
	}
});

// * http.Server.listen(); starts the HTTP server listening for connections. (서버 구동)
// port: 3000
// 웹서버 포트의 기본값은 80 (url 에서 생략 가능)
app.listen(3000);
