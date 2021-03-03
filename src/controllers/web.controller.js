const  { request, response } = require('express');

const pool = require('../config/database');

const indexController = async(req = request, res = response) => {
    const [post] = await pool.query("SELECT * from posts WHERE post_id=1");
    res.render('pages/index', { title: "Inicio", post });
};

const aboutusController = (req = request, res = response) => {
    return res.render('pages/aboutus', {title:'Acerca de Nosotros'} );
};

const historyController = (req = request, res = response) => {
    return res.render('pages/history', {title: 'Historia'});
};

const postController = async(req = request, res = response) => {
    const [post] = await pool.query("SELECT * FROM posts WHERE post_id=7");
    return res.render('pages/posts', { post, title: 'Posts' });
};

const searchController = async(req = request, res = response) => {
    const query = req.query
    console.log(query);
    return res.render('pages/search', { query });
};

module.exports = { indexController, aboutusController, historyController, postController,searchController };