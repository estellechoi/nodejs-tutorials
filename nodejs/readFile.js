// node.js 의 fs(FileSystem) 모듈을 변수에 저장
const fs = require("fs");
fs.readFile("sample.txt", "UTF-8", function (err, data) {
	if (err) throw err;
	console.log(data);
});