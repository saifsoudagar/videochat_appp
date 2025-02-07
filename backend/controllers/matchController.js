// backend/controllers/matchController.js
const pool = require('../db');
const cosineSimilarity = require('../utils/cosineSimilarity');

const getMatches = async(req, res) => {
    const { userId } = req.body;
    try {
        // Get the current user
        const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get current user's interests
        const interestsResult = await pool.query('SELECT interest FROM interests WHERE user_id = $1', [userId]);
        const userInterests = interestsResult.rows.map(row => row.interest);

        // Get other users
        const otherUsersResult = await pool.query('SELECT * FROM users WHERE id != $1', [userId]);
        const otherUsers = otherUsersResult.rows;

        // Calculate cosine similarity for each user
        const matches = await Promise.all(
            otherUsers.map(async(otherUser) => {
                const otherInterestsResult = await pool.query('SELECT interest FROM interests WHERE user_id = $1', [otherUser.id]);
                const otherInterests = otherInterestsResult.rows.map(row => row.interest);
                const similarity = cosineSimilarity(userInterests, otherInterests);
                return { user: otherUser, similarity };
            })
        );

        // Sort matches by descending similarity
        matches.sort((a, b) => b.similarity - a.similarity);
        res.json({ matches });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};

module.exports = { getMatches };