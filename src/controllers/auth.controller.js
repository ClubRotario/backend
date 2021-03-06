const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const bcrypt = require('bcrypt');
const { sendEmail } = require('../helpers/sendEmail');
const { request, response } = require('express');

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
    userDetails.isAdmin = req.isAdmin;
    return res.json({ userDetails });
};

const updateUserProfile = async(req, res) => {
    try{
        const { user_id } = req;
        const { name, last_name, email, phone, address } = req.body;
        const newUserProfile = {
            name, last_name, email, phone, address
        };
        await pool.query('UPDATE users SET ? WHERE user_id=?', [newUserProfile, user_id]);
        return res.json({ message: 'Datos actualizados correctamente' });
    }catch(error){
        console.log(error);
    }
};

const recoveryPassword = async(req, res) => {
    const { email } = req.body;
    const [user] = await pool.query("SELECT * FROM users WHERE email=?", [email]);
    if(user){
        try{
            const { user_id } = user;
            const code = await sendEmail('Código de recuperación', email);
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
            return res.status(400).json({ message: 'El código ingresado no coincide' });
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
        return res.json({ message: 'Contraseña cambiada satisfactoriamente' });
    }catch(error){
        console.log(error);
    }
}

const getSidebar = async(req, res) => {
    try{
        const { user_id } = req;
        const [role] = await pool.query(`SELECT role_id FROM users WHERE user_id=?`, [user_id]);
        const { role_id } = role;
        switch(role_id){
            case 1:
                return res.json( {sidebar: [
                    {
                      path: '/dashboard',
                      icon: 'dw-analytics-9',
                      name: 'Dashboard'
                    },
                    {
                      path: '/dashboard/posts/1',
                      icon: 'dw-file',
                      name: 'Posts'
                    },
                    {
                      path: '/dashboard/users',
                      icon: 'dw-user',
                      name: 'Usuarios'
                    },
                    {
                      path: '/dashboard/profile',
                      icon: 'dw-user1',
                      name: 'Mi Perfil'
                    },
                    {
                      path: '/dashboard/categories',
                      icon: 'dw-menu-2',
                      name: 'Categorias'
                    }
                
                  ]} )
            case 2:
                return res.json({
                    sidebar: [
                        {
                          path: '/dashboard/posts/1',
                          icon: 'dw-file',
                          name: 'Posts'
                        },
                        {
                          path: '/dashboard/profile',
                          icon: 'dw-user1',
                          name: 'Mi Perfil'
                        },
                        {
                          path: '/dashboard/categories',
                          icon: 'dw-menu-2',
                          name: 'Categorias'
                        }
                      ]
                })
        }
    }catch(error){
        console.log(error);
    }
};

const getDashboard = async(req = request, res = response) => {
    try{
        const [{'COUNT(user_id)':totalUsers}] = await pool.query("SELECT COUNT(user_id) FROM users");
        const [{'COUNT(post_id)':totalPosts}] = await pool.query("SELECT COUNT(post_id) FROM posts");
        const lastUsers = await pool.query("SELECT user_id, name, last_name, email, phone, address, created_at FROM users WHERE active=1 ORDER BY user_id DESC LIMIT 3");
        const lastPosts = await pool.query("SELECT p.post_id, p.profile, p.title, p.description, p.published_at, c.category FROM posts AS p JOIN categories AS c ON p.category_id=c.category_id ORDER BY post_id DESC LIMIT 3");
        return res.json({ totalUsers, totalPosts, lastUsers, lastPosts });
    }catch(error){  
        console.log(error);
    }
};

const changePassword = async(req = request, res = response) => {
    try{
        const { oldPassword, newPassword } = req.body;
        const { user_id } = req;
        const [{password}] = await pool.query('SELECT password FROM users WHERE user_id=?', [user_id]); 
        if(!password){ 
            return res.status(400).json({ message: 'Error' });
        }else{
            if( !bcrypt.compareSync( oldPassword, password ) ){
                return res.status(400).json({ message: 'Error' });
            }else{
                const passwordHash = bcrypt.hashSync( newPassword, bcrypt.genSaltSync() );
                await pool.query(`UPDATE users SET password='${passwordHash}' WHERE user_id='${user_id}'`);
                return res.json({ message: 'Datos actualizados' });
            }
        }
    }catch(error){
        console.log(error);  
    }
};

module.exports = { login, registerUser, getUserDetails, recoveryPassword, verifyCode, updatePassword, getSidebar, updateUserProfile, getDashboard, changePassword };