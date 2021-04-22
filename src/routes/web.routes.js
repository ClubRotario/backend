const express = require('express');
const csrfProtection = require('../config/csrfToken');
const router = express.Router();

//Importacion de controladores 
//Este apartado sera el accedido por los usuarios, esta separado de las rutas de la API
const { indexController, aboutusController, historyController, postController, searchController, calendarController, getPostDetails, sendFormEmail, getSocios } = require('../controllers/web.controller');

router.get( '/', csrfProtection, indexController );
router.get( '/nosotros', aboutusController );
router.get('/historia', historyController );
router.get('/posts', postController);
router.get('/buscar', searchController);
router.get('/calendarios', calendarController);
router.get('/post/details/:post_id', getPostDetails);
router.get('/socios', getSocios);

router.post('/form', csrfProtection, sendFormEmail);

module.exports = router;