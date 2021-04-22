const express = require('express');
const { getProfile } = require('../controllers/profile.controller');
const { verifyToken } = require('../middlewares/auth');
const router = express.Router();

router.get('/', [verifyToken], getProfile);

module.exports = router;