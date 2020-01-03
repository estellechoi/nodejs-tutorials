// node.js 모듈
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

// 함수
function getTemplateHTML(title, list, body) {
	// Template Literals
	return `
			<!doctype html>
			<html>
			<head>
				<title>WEB2 - ${title}</title>
				<meta charset="utf-8">
			</head>
			<body>
				<h1><a href="/">WEB</a></h1>
				${list}
				<a href="/create">create</a>
				${body}
			</body>
			</html>
	`;
}

function getTemplateList(fileList) {
	var list = "<ul>";
	fileList.forEach(function (file) {
		var li = `<li><a href="/?id=${file}">${file}</a></li>`;
		list += li;
	});
	list = list + "</ul>";
	return list;
}

// 어플리케이션
// 웹어플리케이션 접속이 발새할 때마다 createServer의 콜백함수가 호출된다.
var app = http.createServer(function (request, response) {
	var _url = request.url; // 사용자 요청에서 url을 반환
	console.log(url.parse(_url, true)); // 해당 url을 파싱하여 객체를 반환

	var queryData = url.parse(_url, true).query; // query String 정보를 담은 객체 반환
	var pathname = url.parse(_url, true).pathname; // queryString 제외한 path 반환

	if (pathname === "/") {
		// queryString 이 없을 때 (홈 화면)
		if (queryData.id === undefined) {
			// fs.readdir(); 폴더의 파일 목록을 가져오기 (파일명)
			// 비동기 메소드이다.
			fs.readdir("./data", function (err, fileList) {
				var title = "Welcome";
				var data = "Hello node.js";
				var list = getTemplateList(fileList);
				var template = getTemplateHTML(title, list, `<h2>${title}</h2><p>${data}</p>`);
				response.writeHead(200); // 응답코드
				response.end(template); // template 을 응답
			});
		}
		// queryString 있을 때
		else {
			fs.readdir("./data", function (err, fileList) {
				// fs.readFile(); 파일 내용 읽어오기
				fs.readFile(`data/${queryData.id}`, "UTF-8", function (err, data) {
					var title = queryData.id;
					var list = getTemplateList(fileList);
					var template = getTemplateHTML(title, list, `<h2>${title}</h2><p>${data}</p>`);
					// fs.readFileSync : 경로에 해당하는 파일을 읽어서 가져온다.
					// response.end(fs.readFileSync(__dirname + url));
					response.writeHead(200);
					response.end(template);
				});
			});
		}
	} else if (pathname === "/create") {
		fs.readdir("./data", function (err, fileList) {
			var title = "Create";
			var list = getTemplateList(fileList);
			var template = getTemplateHTML(title, list, `
				<form action="/create_process" method="post">
					<input type="text" name="title" placeholder="title"><br>
					<textarea name="description" placeholder="description"></textarea><br>
					<input type="submit" value="ok"><br>
				</form>
			`);
			response.writeHead(200); // 응답코드
			response.end(template); // template 을 응답
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
			var title = postData.title;
			var description = postData.description;

			// * fs.writeFile(파일 경로, 파일 내용, 인코딩, 콜백함수); 데이터를 파일로 저장
			fs.writeFile(`data/${title}`, description, "UTF-8", function (err) {
				// 콜백함수의 결과에 따라 수행될 내용은 비동기 메소드 안에 작성해야 ..
				// * redirect 코드 : 302
				response.writeHead(302, {
					Location: `/?id=${title}`
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
// port: 3000
// 웹서버 포트의 기본값은 80 (url 에서 생략 가능)
app.listen(3000);