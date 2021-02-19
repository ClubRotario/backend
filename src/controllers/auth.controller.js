const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const bcrypt = require('bcrypt');

const login = async(req, res) => {

    const { email, password } = req.body;
    const user = await pool.query(`SELECT user_id, password FROM users WHERE email=?`, [email]);
    if(user.length === 0){
        return res.json({ message: 'Correo o contraseña incorrectos' });
    }else{
        const { user_id, password: hash } = user[0];
        if(bcrypt.compareSync( password, hash )){
            const token = jwt.sign({ user_id: user_id }, process.env.SECRET, { expiresIn: '7d' });
            return res.json({ token });
        }else{
            return res.status(400).json({ message: 'Correo o contraseña incorrectos' });
        }
    }

};

const registerUser = async(req, res) => {
    const { name, last_name, email, password, phone, address } = req.body;

    const newUser = {
        name,
        last_name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
        phone,
        address,
        role_id: 1
    }

    try{
        const userResult = await pool.query(`INSERT INTO users SET ?`, [newUser]);
        return res.json({ message: 'El usuario fue registrado correctamente' });
    }catch(error){
        console.log(error);
    }
};

const getUserDetails = async(req, res) => {
    const { user_id } = req;
    const user = await pool.query("SELECT u.name, u.last_name, u.email, u.address, u.phone, r.role FROM users as u JOIN roles as r ON u.role_id = r.role_id WHERE user_id=?",[user_id]);
    if(user.length === 0){
        return res.status(403).json({ message: 'Usuario no encontrado' });
    }
    const userDetails = user[0];
    userDetails.userId = user_id;
    return res.json({ userDetails });
};

module.exports = { login, registerUser, getUserDetails };