const mysql = require("mysql");

const con = mysql.createConnection({
    connectionLimit: 100,
    host: "mariadb106.server250469.nazwa.pl",
    user: "server250469_hideisland",
    password: "SwinkaPeppa-31",
    database: "server250469_hideisland"
});

module.exports = con;
