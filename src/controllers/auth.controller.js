const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const bcrypt = require('bcrypt');
const { sendEmail } = require('../helpers/sendEmail');

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

const recoveryPassword = async(req, res) => {
    const { email } = req.body;
    const [user] = await pool.query("SELECT * FROM users WHERE email=?", [email]);
    if(user){
        try{
            const { user_id } = user;
            const code = await sendEmail('Codigo de recuperación', email);
            newCode = {
                user_id,
                code
            }
            await pool.query("DELETE FROM codes WHERE user_id=?",[user_id]);
            await pool.query("INSERT INTO codes SET ?", [newCode]);
            return res.json({ user_id });
        }catch(error){
            console.log(error);
        }
    }else{
        return res.status(400).json({ message: 'No encontrado' });
    }
};

const verifyCode = async(req, res) => {
    const { user_id, code } = req.body;
    const [codeVerify] = await pool.query("SELECT * FROM codes WHERE user_id=?", [user_id]);
    console.log(codeVerify.code);
    if(!codeVerify){
        return res.json({ message: 'Error con el sistema al momento de verificar el código' });
    }else{
        if( code !== codeVerify.code ){
            return res.status(400).json({ message: 'El codigo ingresado no coincide' });
        }else{
            await pool.query("DELETE FROM codes WHERE user_id=?", [user_id]);
            return res.json({ message: 'Código verificado correctamente' });
        }
    }
};

const updatePassword = async(req, res) => {
    const { password: pass, user_id } = req.body;
    const password =  bcrypt.hashSync(pass, bcrypt.genSaltSync(10))


    try{
        await pool.query("UPDATE users SET password=? WHERE user_id=?",[password, user_id]);
        return res.json({ message: 'Contraseña cambiada sastifactoriamente' });
    }catch(error){
        console.log(error);
    }
}


module.exports = { login, registerUser, getUserDetails, recoveryPassword, verifyCode, updatePassword };