// templates
const template = {
	getHTML: function (title, list, body, crud, path, auth) {
		const uiByAuth = auth
			? `Hello, estele.choi@gmail.com! If you want to sign out, click <a href="/signout_process">here</a>`
			: `<a href="/author">author</a><a href="/signin">Sign in</a>`;

		const uiByPath =
			path && path === "/signin"
				? ""
				: `
				<p>
				 ${uiByAuth}
				</p>`;

		// Template Literals
		return `
				<!doctype html>
				<html>
				<head>
					<title>WEB2 - ${title}</title>
					<meta charset="utf-8">
					<style>
					a {
						text-decoration: none;
						font-style: italic;
						font-weight: bold;
						color: black;
						padding: 5px;
						border: 1px solid black;
						border-radius: 10px;
					}
					
					li {
						list-style-type: none;
					}

					li a {
						border: none;
						color: #828282;
					}

					form {
						display: inline-block;
					}
					
					input[type="submit"] {
						background: #4c4c4c;
						font-weight: bold;
						font-style: italic;
						font-size: 1rem;
						padding: 5px;
						border: 1px solid #4c4c4c;
						border-radius: 10px;
						color: white;
					}
					
					table {
						border-collapse: collapse;
						margin-top: 10px;
					}
					td {
						border: 1px solid black;
						padding: 5px 10px;
					}

					.para {
						border: 1px solid #4c4c4c;
						padding: 10px;
						width: 30%;
					}
					.sub_info {
						display: inline-block;
						font-style: italic;
						color: brown;
						margin-top: 0;
						padding-top: 0;
					}
					
					</style>
				</head>
				<body>
					<h1><a href="/">Welcome to CEPO</a></h1>
					${uiByPath}
					${list}
					${crud ? crud : ""}
					${body}
				</body>
				</html>
		`;
	},
	getList: function (data) {
		let list = "<ul>";
		data.forEach(function (item) {
			// var li = `<li><a href="/?id=${item}">${item}</a></li>`;
			const li = `<li><a href="/?id=${item.id}">${item.title}</a></li>`;
			list += li;
		});
		list = list + "</ul>";
		return list;
	},
	getTable: function (data) {
		let table = "<table>";
		let style = ``;
		data.forEach((item) => {
			const tr = `<tr>
						<td>${item.id}</td>
						<td>${item.name}</td>
						<td>${item.profile}</td>
					</tr>`;
			table += tr;
		});

		table += "</table>";
		return table + style;
	},
	getUpdateTable: function (data) {
		let table = "<table>";
		const style = `
					<style>
						table {
							border-collapse: collapse;
							margin-top: 10px;
						}
						td {
							border: 1px solid black;
							padding: 0 10px;
						}
					</style>
					`;
		data.forEach((item) => {
			const tr = `<tr>
						<form action="/update_author_process" method="post">
							<input type="hidden" name="id" value="${item.id}"/>
							<td>${item.id}</td>
							<td><input type="text" name="name" placeholder="Name" value="${item.name}"/></td>
							<td><input type="text" name="profile" placeholder="Profile" value="${item.profile}"/></td>
							<td><input type="submit" value="Update" /></td>
							<td><a href="/delete_author_process?id=${item.id}">X</a></td>
						</form>
					</tr>`;
			table += tr;
		});

		table += "</table>";
		return table + style;
	},
};

// 객체 모듈화
module.exports = template;
