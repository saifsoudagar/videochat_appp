// backend/config/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER, // e.g., 'postgres'
    host: process.env.DB_HOST, // e.g., 'localhost'
    database: process.env.DB_NAME, // your database name
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT, // e.g., 5432
});

module.exports = pool;