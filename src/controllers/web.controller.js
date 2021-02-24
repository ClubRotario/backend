const  { request, response } = require('express');

const pool = require('../config/database');

const indexController = async(req = request, res = response) => {
    const [post] = await pool.query("SELECT * from posts WHERE post_id=1");
    res.render('pages/index', { title: "Inicio", post });
};

const aboutusController = (req = request, res = response) => {
    return res.render('pages/aboutus', {title:'Acerca de Nosotros'} );
}
module.exports = { indexController, aboutusController };