const pool = require('../db');

const createUser = async(username, hashedPassword) => {
    return pool.query(
        'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, hashedPassword]
    );
};

const findUserByUsername = async(username) => {
    return pool.query(
        'SELECT * FROM users WHERE username = $1', [username]
    );
};

const getUserInterests = async(userId) => {
    return pool.query(
        'SELECT interest FROM interests WHERE user_id = $1', [userId]
    );
};

module.exports = { createUser, findUserByUsername, getUserInterests };