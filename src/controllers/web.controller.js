const  { request, response } = require('express');

const pool = require('../config/database');

const indexController = async(req = request, res = response) => {
    const posts = await pool.query(`SELECT P.post_id, P.profile, P.title, P.published_at, P.description, C.category
    FROM posts as P       
    JOIN categories as C ON P.category_id = C.category_id
    WHERE P.published = 1
    ORDER BY 1 DESC limit 3`);
    console.log(posts);
    res.render('pages/index', { title: "Inicio", posts });
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