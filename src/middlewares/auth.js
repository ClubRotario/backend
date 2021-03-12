const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const verifyToken = (req, res, next) => {
    if(!req.get('token')){
        return res.status(403).json({ message: 'Token no recibido' });
    }else{
        const token = req.get('token');
        jwt.verify( token, process.env.SECRET, async(error, dec) => {
            if(error){
                return res.status(403).json({ message: 'Token no valido' });
            }
            const { user_id } = dec;
            req.user_id = user_id;
            const [role] = await pool.query("SELECT role_id FROM users WHERE user_id=?", [user_id]);
            const { role_id } = role;
            req.isAdmin = role_id == 1;
            next();
        });
    }
};

module.exports = { verifyToken };