var M = {
	v: "v",
	f: function () {
		console.log(this.v);
	}
}

// 객체 M을 이 JS파일 외부에서 모듈로 사용할 수 있도록 export
module.exports = M;