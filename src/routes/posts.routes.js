const express = require('express');
const { imageUploader, profileUpload } = require('../config/multer');
const { saveOneImage } = require('../controllers/images.controller');
const { saveOnePost, getManyPosts, getOnePost, getManyCategories, updatePost, publishPost, updateProfile, saveAsEntrie, deleteTag, addTag, deletePost } = require('../controllers/posts.controller');
const { verifyToken } = require('../middlewares/auth');
const { Router } = express;

const router = Router();

//Ruta para guardar un Post
router.post('/', saveOnePost);

//Ruta para obtener todos los posts
router.get('/:page', [verifyToken], getManyPosts);

//Ruta para obtener un unico post
router.get('/one/:id', getOnePost);

//Ruta para actualizar un post
router.put('/', updatePost);

//Ruta para actualizar el perfil de un post
router.post('/profile', [profileUpload], updateProfile);

//Ruta para publicar el post
router.put('/publish', publishPost);

//Ruta para agendar el post
router.put('/entry', saveAsEntrie);

//Ruta para subir imagenes
router.post('/images/upload', [imageUploader], saveOneImage);

//Ruta para obetener las categorias del post
router.get('/data/categories', getManyCategories);

//Ruta para administrar los tags del post
router.delete('/tags/:tag_id', deleteTag);

router.post('/add/tags', addTag);

//Eliminar un post
router.delete('/post', deletePost);

module.exports = router;