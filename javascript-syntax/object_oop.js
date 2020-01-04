// var v1 = "v1";
// var v2 = "v2";

// Object Literal 패턴으로 연관된 변수와 함수를 하나의 객체에 담는다.
var o = {
	v1: "v1",
	v2: "v2",
	f1: function () {
		console.log(this.v1); // this : 함수가 속한 객체를 참조한다.
	},
	f2: function () {
		console.log(this.v2);
	}
}

o.f1();
o.f2();