const express = require('express');
const { getManyUsers, getUserByName, saveOneUser, deleteUser } = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

router.get('/', [verifyToken], getManyUsers);
router.get('/user', [verifyToken], getUserByName);

//Registro de usuario
router.post('/', [verifyToken], saveOneUser);

router.delete('/:id', [verifyToken], deleteUser);

module.exports = router;