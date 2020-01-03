var args = process.argv;
console.log(args);
// 배열의 index 2 부터 사용자가 입력한 argument 값이 저장된다.
console.log(args[2]);

// 조건문과 함께 사용해보자.
if (args[2] === "1") {
	console.log(args[2]);
} else {
	console.log("1이 아닙니다.");
}