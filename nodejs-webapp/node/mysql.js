var mysql = require("mysql");

var connection = mysql.createConnection({
	host: "localhost", // node.js 의 서버와 같은 서버이다.
	user: "temp_user",
	password: "yk0425",
	database: "board_node",
});

connection.connect();

connection.query("SELECT * FROM topic", function (error, results, fields) {
	if (error) throw error;
	console.log(results);
});

connection.end();
