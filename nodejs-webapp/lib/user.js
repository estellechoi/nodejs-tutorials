const connection = require("./db");
const template = require("./template");
const qs = require("querystring");

exports.home = function (request, response, queryData) {
	connection.query(`SELECT * FROM topic`, (err, topics) => {
		if (err) throw err; // if error occurs, console prints the error and this app stops.
		connection.query(`SELECT * FROM author`, (err2, authors) => {
			const title = "Welcome";
			const list = template.getList(topics); // topics is an array of objects.
			const userTable = template.getTable(authors); // same as topics
			const html = template.getHTML(
				title,
				list,
				userTable,
				`<form action="create_author_process" method="post">
                    <p>
                        <input type="text" name="name" placeholder="Name" />
                    </p>
                    <p>
                        <input type="text" name="profile" placeholder="Profile" />
                    </p>
                    <div>
                        <input type="submit" value="Submit" />
                        <a href="/update_author">Update/Delete</a>
                    </div>
                </form>`
			);
			response.writeHead(200);
			response.end(html);
		});
	});
};

exports.createProcess = function (request, response, queryData) {
	let body = "";
	request.on("data", (data) => {
		body += data;
		if (body.length > 1e6) request.connection.destroy();
	});

	request.on("end", () => {
		const postData = qs.parse(body); // 왜 queryString.parse() ? formData 를 객체로 변환 ?
		const name = postData.name;
		const profile = postData.profile;

		const query = connection.query(
			`INSERT INTO author (name, profile) VALUES (?, ?)`,
			[name, profile],
			(err, results) => {
				if (err) throw err;

				response.writeHead(302, {
					Location: `/author`,
				});
				response.end();
			}
		);
		console.log(query.sql);
	});
};

exports.update = function (request, response, queryData) {
	connection.query(`SELECT * FROM topic`, (err, topics) => {
		if (err) throw err; // if error occurs, console prints the error and this app stops.
		connection.query(`SELECT * FROM author`, (err2, authors) => {
			const title = "Welcome";
			const list = template.getList(topics); // topics is an array of objects.
			const updateTable = template.getUpdateTable(authors); // same as topics
			const html = template.getHTML(
				title,
				list,
				updateTable,
				`<a href="/author">Cancel</a>`
			);
			response.writeHead(200);
			response.end(html);
		});
	});
};

exports.updateProcess = function (request, response, queryData) {
	let body = "";
	request.on("data", function (data) {
		body += data;
	});
	request.on("end", function () {
		const postData = qs.parse(body);
		const id = postData.id;
		const name = postData.name;
		const profile = postData.profile;

		connection.query(
			`UPDATE author SET name = ?, profile = ? WHERE id = ?`,
			[name, profile, id],
			(err) => {
				if (err) throw err;

				response.writeHead(302, {
					Location: `/author`,
				});
				response.end();
			}
		);
	});
};

exports.deleteProcess = function (request, response, queryData) {
	// * security tips
	// `DELETE FROM author WHERE id = ${queryData.id}` => SQL injection attacks can occur through queryString manipulation.
	// ${connection.escape(queryData.id)} => escape() method is one of the ways to avoid SQL injection attack. (embrace user's input with '')
	connection.query(`DELETE FROM author WHERE id = ?`, [queryData.id], (err) => {
		if (err) throw err;

		response.writeHead(302, { Location: `/author` });
		response.end();
	});
};
