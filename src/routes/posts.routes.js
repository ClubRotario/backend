const express = require('express');
const { imageUploader } = require('../config/multer');
const { saveOneImage } = require('../controllers/images.controller');
const { saveOnePost, getManyPosts, getOnePost, getManyCategories, updatePost, publishPost } = require('../controllers/posts.controller');
const { Router } = express;

const router = Router();

//Ruta para guardar un Post
router.post('/', saveOnePost);

//Ruta para obtener todos los posts
router.get('/:page', getManyPosts);

//Ruta para obtener un unico post
router.get('/one/:id', getOnePost);

//Ruta para actualizar un post
router.put('/', updatePost);

//Ruta para publicar el post
router.put('/publish', publishPost);

//Ruta para subir imagenes
router.post('/images/upload', [imageUploader], saveOneImage);

//Ruta para obetener las categorias del post
router.get('/data/categories', getManyCategories);

module.exports = router;