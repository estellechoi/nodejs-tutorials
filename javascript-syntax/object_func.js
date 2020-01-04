function f() {
	console.log("I am a function.");
}

// 배열에 함수를 넣어보자
var a = [f];
a[0](); // 호출

// 객체에 함수를 넣어보자
var o = {
	func: f
}
o.func(); // 호출