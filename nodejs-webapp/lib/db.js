var mysql = require("mysql");

// connecting to mysql server
const connection = mysql.createConnection({
	host: "localhost",
	user: "temp_user",
	password: "yk0425",
	database: "board_node",
});

connection.connect();

module.exports = connection;
