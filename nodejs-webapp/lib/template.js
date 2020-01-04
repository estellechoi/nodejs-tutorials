// 객체 리터럴 패턴으로 연관된 변수와 함수를 하나의 객체에 담아보자.
var template = {
	getHTML: function (title, list, body, crud) {
		// Template Literals
		return `
				<!doctype html>
				<html>
				<head>
					<title>WEB2 - ${title}</title>
					<meta charset="utf-8">
				</head>
				<body>
					<h1><a href="/">WEB</a></h1>
					${list}
					${crud}
					${body}
				</body>
				</html>
		`;
	},
	getList: function (fileList) {
		var list = "<ul>";
		fileList.forEach(function (file) {
			var li = `<li><a href="/?id=${file}">${file}</a></li>`;
			list += li;
		});
		list = list + "</ul>";
		return list;
	}
}

module.exports = template;