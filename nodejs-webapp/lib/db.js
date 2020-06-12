var mysql = require("mysql");

// connecting to mysql server
// this is just to show original format, the user, password and other db connection information should be seperated and git-ignored for security.
const connection = mysql.createConnection({
	host: "localhost",
	user: "temp_user",
	password: "yk0425",
	database: "board_node",
});

connection.connect();

module.exports = connection;
