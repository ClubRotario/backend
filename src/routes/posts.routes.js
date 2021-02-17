const express = require('express');
const { imageUploader } = require('../config/multer');
const { saveOneImage } = require('../controllers/images.controller');
const { saveOnePost, getManyPosts, getOnePost } = require('../controllers/posts.controller');
const { Router } = express;

const router = Router();

//Ruta para guardar un Post
router.post('/', saveOnePost);

//Ruta para obtener todos los posts
router.get('/:page', getManyPosts);

//Ruta para obtener un unico post
router.get('/one/:id', getOnePost);

//Ruta para subir imagenes
router.post('/images/upload', [imageUploader], saveOneImage);

module.exports = router;