/*
function a() {
	console.log("A");
}
*/

// 익명함수를 변수에 저장
// * JavaScript 에서 함수는 값이다.
var a = function () {
	console.log("A");
}

function slowFunc(callback) {
	callback();
}

slowFunc(a);