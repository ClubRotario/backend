const express = require('express');
const { check } = require('express-validator')

const { login, registerUser, getUserDetails, recoveryPassword, verifyCode, updatePassword, getSidebar } = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth');
const { checkValidations } = require('../middlewares/checkValidations');

const router = express.Router();

//Ruta para el login de los usuarios
router.post( '/login', 
[ 
    check('email', 'El correo es obligatorio para iniciar sesión').not().isEmpty(),
    check('password', 'La contraseña es obligatoria para iniciar sesión').not().isEmpty(),
    check('email', 'Email no valido').isEmail(),
    checkValidations
],
login );

//Ruta para el registro de nuevos usuarios al sistema
router.post( '/register', registerUser );

//Obetener los detalles del usuario para mostrarlos en el dashboard
router.get( '/details', [verifyToken], getUserDetails );

//Rutas para la recuperacion de contraseñas
router.post('/recovery', recoveryPassword);
router.post('/verify/code', verifyCode);

//Ruta para la actualización de la contraseña
router.put('/password', updatePassword);

//Ruta para verificar si el usuario tiene un token activo
router.get('/is-logged', [verifyToken], (req, res) => {
    return res.json({ message: 'logged' });
});

router.get('/sidebar', [verifyToken], getSidebar);

module.exports = router;