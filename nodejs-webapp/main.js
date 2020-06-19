// modules of node.js (내장모듈)
const http = require("http");
const url = require("url");

// module self-made
const topic = require("./lib/topic");
const user = require("./lib/user");
const auth = require("./lib/auth");

// * http.createServer(requestListener); http.Server 객체를 반환한다.
// * The requestListener is a function which is automatically added to the 'request' event.
// -> 웹어플리케이션 접속시마다 createServer의 콜백함수가 호출된다.
const app = http.createServer(function (req, res) {
	const _url = req.url; // 사용자 요청에서 url을 반환
	console.log(url.parse(_url, true)); // 해당 url을 파싱하여 객체를 반환

	const queryData = url.parse(_url, true).query; // query String 정보를 담은 객체 반환
	const pathname = url.parse(_url, true).pathname; // queryString 제외한 path 반환

	if (pathname === "/") {
		if (queryData.id === undefined) topic.home(req, res, queryData);
		else topic.page(req, res, queryData);
	} else if (pathname === "/create") {
		topic.create(req, res, queryData);
	} else if (pathname === "/create_process") {
		topic.createProcess(req, res, queryData);
	} else if (pathname === "/update") {
		topic.update(req, res, queryData);
	} else if (pathname === "/update_process") {
		topic.updateProcess(req, res, queryData);
	} else if (pathname === "/delete_process") {
		topic.deleteProcess(req, res, queryData);
	} else if (pathname === "/author") {
		user.home(req, res, queryData);
	} else if (pathname === "/create_author_process") {
		user.createProcess(req, res, queryData);
	} else if (pathname === "/update_author") {
		user.update(req, res, queryData);
	} else if (pathname === "/update_author_process") {
		user.updateProcess(req, res, queryData);
	} else if (pathname === "/delete_author_process") {
		user.deleteProcess(req, res, queryData);
	} else if (pathname === "/signin") {
		auth.signin(req, res, queryData, pathname);
	} else if (pathname === "/signin_process") {
		auth.signinProcess(req, res, queryData, pathname);
	} else if (pathname === "/signout_process") {
		auth.signoutProcess(req, res, queryData, pathname);
	} else {
		res.writeHead(404);
		res.end("Not found");
	}
});

// * http.Server.listen(); starts the HTTP server listening for connections. (서버 구동)
// port: 3000
// 웹서버 포트의 기본값은 80 (url 에서 생략 가능)
app.listen(3000);
