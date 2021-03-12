const { request, response } = require('express');
const pool = require('../config/database');
const bcrypt = require('bcrypt');

const getManyUsers = async(req = request, res = response) => {
    try{
        const users = await pool.query("SELECT u.user_id, CONCAT(u.name, ' ',u.last_name) AS 'fullName', u.email, u.phone, u.address, u.created_at, u.last_login, r.role FROM users AS u JOIN roles AS r ON u.role_id = r.role_id WHERE u.active = 1");
        
        return res.json({ users });
    }catch(error){
        console.log(error);
    }
};

const getUserByName = async( req = request, res = response ) => {
    try{
        const { name } = req.query;
        console.log(name);
        const users = await pool.query(`SELECT u.user_id, CONCAT(u.name, ' ',u.last_name) AS 'fullName', u.email, u.phone, u.address, u.created_at, u.last_login, r.role FROM users AS u JOIN roles AS r ON u.role_id = r.role_id WHERE u.active = 1 AND CONCAT(u.name, ' ',u.last_name) LIKE '%${name}%'`);
        return res.json({ users });
    }catch(error){
        console.log(error);
    }
};

const saveOneUser = async( req = request, res = response ) => {
    try{
        const { address, email, name, lastName: last_name, password, phone, role:role_id } = req.body;

        const existUser = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        console.log(existUser);
        if(existUser.length > 0){
            return res.status(400).json({ message: 'Ya existe un usuario registrado con ese correo' });
        }else{
            const passwordHash = bcrypt.hashSync( password, bcrypt.genSaltSync(10) );
            const newUser = {
                name,
                last_name,
                email,
                address,
                phone,
                password:  passwordHash,
                role_id
            };

            await pool.query("INSERT INTO users SET ?", [newUser]);
            return res.json({ message: 'Usuario registrado correctamente' });
        }
    }catch(error){
        console.log(error);
    }
}

module.exports = { getManyUsers, getUserByName, saveOneUser };