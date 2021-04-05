const express = require('express');
const { getManyUsers, getUserByName, saveOneUser, deleteUser } = require('../controllers/user.controller');

const router = express.Router();

router.get('/', getManyUsers);
router.get('/user', getUserByName);

//Registro de usuario
router.post('/', saveOneUser);

router.delete('/:id', deleteUser);

module.exports = router;