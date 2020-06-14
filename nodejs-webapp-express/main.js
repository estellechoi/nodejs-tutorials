// modules of node.js (내장모듈)
var http = require("http");
var url = require("url");

// module self-made
var topic = require("./lib/topic");
var user = require("./lib/user");

// * http.createServer(requestListener); http.Server 객체를 반환한다.
// * The requestListener is a function which is automatically added to the 'request' event.
// -> 웹어플리케이션 접속시마다 createServer의 콜백함수가 호출된다.
var app = http.createServer(function (request, response) {
	var _url = request.url; // 사용자 요청에서 url을 반환
	console.log(url.parse(_url, true)); // 해당 url을 파싱하여 객체를 반환

	var queryData = url.parse(_url, true).query; // query String 정보를 담은 객체 반환
	var pathname = url.parse(_url, true).pathname; // queryString 제외한 path 반환

	if (pathname === "/") {
		if (queryData.id === undefined) topic.home(request, response, queryData);
		else topic.page(request, response, queryData);
	} else if (pathname === "/create") {
		topic.create(request, response, queryData);
	} else if (pathname === "/create_process") {
		topic.createProcess(request, response, queryData);
	} else if (pathname === "/update") {
		topic.update(request, response, queryData);
	} else if (pathname === "/update_process") {
		topic.updateProcess(request, response, queryData);
	} else if (pathname === "/delete_process") {
		topic.deleteProcess(request, response, queryData);
	} else if (pathname === "/author") {
		user.home(request, response, queryData);
	} else if (pathname === "/create_author_process") {
		user.createProcess(request, response, queryData);
	} else if (pathname === "/update_author") {
		user.update(request, response, queryData);
	} else if (pathname === "/update_author_process") {
		user.updateProcess(request, response, queryData);
	} else if (pathname === "/delete_author_process") {
		user.deleteProcess(request, response, queryData);
	} else {
		response.writeHead(404);
		response.end("Not found");
	}
});

// * http.Server.listen(); starts the HTTP server listening for connections. (서버 구동)
// port: 3000
// 웹서버 포트의 기본값은 80 (url 에서 생략 가능)
app.listen(3000);
