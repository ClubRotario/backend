const express = require('express');
const { saveOnePost, getManyPosts } = require('../controllers/posts.controller');
const { Router } = express;

const router = Router();

router.get('/:id', getManyPosts);
router.post('/', saveOnePost);


module.exports = router;