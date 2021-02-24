const express = require('express');
const router = express.Router();

//Importacion de controladores 
//Este apartado sera el accedido por los usuarios, esta separado de las rutas de la API
const { indexController, aboutusController } = require('../controllers/web.controller');

router.get( '/', indexController );
router.get( '/nosotros', aboutusController);

module.exports = router;