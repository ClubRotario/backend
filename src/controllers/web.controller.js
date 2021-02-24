const  { request, response } = require('express');

const pool = require('../config/database');

const indexController = async(req = request, res = response) => {
    const [post] = await pool.query("SELECT * from posts WHERE post_id=12");
    res.render('pages/index', { title: "Inicio", post });
};

module.exports = { indexController };