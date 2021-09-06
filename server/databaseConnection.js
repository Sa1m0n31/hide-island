const mysql = require("mysql");

const con = mysql.createConnection({
    host: "18421_hideisland.skylo-pl.atthost24.pl",
    user: "18421_hideisland",
    password: "***** *** (Sw...)",
    database: "18421_hideisland"
});

module.exports = con;
