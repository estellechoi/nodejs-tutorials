const testFolder = "./data/"; // 실행 위치 기준 (* 상대경로는 실행파일 기준이 아니다.)
const fs = require("fs"); // fs 모듈을 변수에 저장

fs.readdir(testFolder, function (err, fileList) {
	// fs.readdir(); 해당 폴더의 파일목록을 배열로 저장한다.
	fileList.forEach(function (file) {
		console.log(file);
	});
});