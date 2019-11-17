require('dotenv').config();
const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: 1000,
  connectTimeout: 30*1000,
  acquireTimeout: 30*1000,
  timeout: 30*1000,
  host  : process.env.DB_HOST,
  user  : process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

module.exports = pool;