const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    if(!req.get('token')){
        return res.status(403).json({ message: 'Token no recibido' });
    }else{
        const token = req.get('token');
        jwt.verify( token, process.env.SECRET, (error, dec) => {
            if(error){
                return res.status(403).json({ message: 'Token no valido' });
            }
            const { user_id } = dec;
            req.user_id = user_id;
            next();
        });
    }
};

module.exports = { verifyToken };