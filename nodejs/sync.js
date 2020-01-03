// FileSystem 모듈
var fs = require("fs");

// 동기
// 반환값이 있다.
console.log("a"); // 1
var result = fs.readFileSync("nodejs/test.txt", "UTF-8");
console.log(result); // 2
console.log("c"); // 3


// 비동기
// 반환값이 없고, 콜백함수가 필요하다.
console.log("a"); // 1
fs.readFile("nodejs/test.txt", "UTF-8", function (err, data) {
	console.log(data); // 3
});
console.log("c"); // 2