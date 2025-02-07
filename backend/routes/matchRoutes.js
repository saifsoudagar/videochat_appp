// backend/routes/matchRoutes.js
const express = require('express');
const router = express.Router();
const { getMatches } = require('../controllers/matchController');
const authenticate = require('../middleware/authMiddleware');

router.post('/', authenticate, getMatches);

module.exports = router;