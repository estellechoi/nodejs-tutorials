// node.js 모듈
var http = require('http');
var fs = require('fs');
var url = require('url');

// 함수
function getTemplateHTML(title, list, body) {
	// Template Literals
	return `
			<!doctype html>
			<html>
			<head>
				<title>WEB1 - ${title}</title>
				<meta charset="utf-8">
			</head>
			<body>
				<h1><a href="/">WEB</a></h1>
				${list}
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
		// pathname !== "/" (경로 오류)
	} else {
		response.writeHead(404);
		response.end("Not found");
	}
});
// port: 3000
// 웹서버 포트의 기본값은 80 (url 에서 생략 가능)
app.listen(3000);