const express = require('express');
const { getManyUsers, getUserByName, saveOneUser } = require('../controllers/user.controller');

const router = express.Router();

router.get('/', getManyUsers);
router.get('/user', getUserByName);

//Registro de usuario
router.post('/', saveOneUser);

module.exports = router;