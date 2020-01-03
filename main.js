var http = require('http');
var fs = require('fs');
var url = require('url'); // url 모듈을 변수에 저장

var app = http.createServer(function (request, response) {
	var _url = request.url;
	var queryData = url.parse(_url, true).query; // query 정보를 담은 객체 반환
	var title = queryData.id;

	if (_url == '/') {
		title = "welcome";
		_url = '/index.html';
	}
	if (_url == '/favicon.ico') {
		return response.writeHead(404);
	}
	response.writeHead(200);

	// 파일 읽기
	fs.readFile(`data/${queryData.id}`, "UTF-8", function (err, data) {
		var template = `
      <!doctype html>
      <html>
      <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        <ol>
          <li><a href="/?id=HTML">HTML</a></li>
          <li><a href="/?id=CSS">CSS</a></li>
          <li><a href="/?id=JavaScript">JavaScript</a></li>
        </ol>
        <h2>${title}</h2>
        <p>${data}</p>
      </body>
      </html>
      `;
		// fs.readFileSync : 경로에 해당하는 파일을 읽어서 가져온다.
		// response.end(fs.readFileSync(__dirname + url));
		response.end(template);
	});
});
// port: 3000
// 웹서버 포트의 기본값은 80 (url 에서 생략 가능)
app.listen(3000);