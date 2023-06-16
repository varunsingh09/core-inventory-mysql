const { dbConfig } = require('./config');
const mysql = require('mysql');


const { host, user, password, database } = dbConfig;
const mysqlConnection = mysql.createPool({
    connectionLimit: 1,
    host,
    user,
    password,
    database,
    multipleStatements: true
});

mysqlConnection.on('connection', connection => {
    console.log('Connected to DB');    
});

module.exports = mysqlConnection;