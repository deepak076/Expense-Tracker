const { error } = require('console');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'dj25082001',
    database: 'node-complete',
});

db.connect(err =>{
    if(err){
        console.error('Error connecting yo MySQL:', err);
        return;
    }
    console.log('Connected to MySQL db');
});

module.exports = db;