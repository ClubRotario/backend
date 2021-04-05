const  { request, response } = require('express');

const pool = require('../config/database');

const indexController = async(req = request, res = response) => {
    const posts = await pool.query(`SELECT P.post_id, P.profile, P.title, P.published_at, P.description, C.category, CONCAT(u.name, ' ', u.last_name) AS 'author'
    FROM posts as P       
    JOIN categories as C ON P.category_id = C.category_id
    JOIN users AS u ON p.user_id=u.user_id
    WHERE P.published = 1
    ORDER BY 1 DESC limit 3`);
    const meta = {
        description: 'Club rotario de la ciudad de La Paz, Honduras',
        title: 'Rotary Club La Paz',
        image: `${process.env.DOMAIN}/img/rotary_club-logo.png`,
    }
    res.render('pages/index', { header:{ title: "Inicio" }, posts, meta });
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

const calendarController = async(req = request, res = response) => {
    try{
        const events = await pool.query("SELECT p.title AS 'title', e.post_id, e.start, e.end FROM entries AS e JOIN posts AS p ON e.post_id=p.post_id");
        return res.render('pages/calendar', { events });
    }catch(error){
        console.log(error);
    }
};

const getPostDetails = async(req = request, res = response) => {
    try{
        const { post_id } = req.params;
        const [postDetails] = await pool.query("SELECT p.title, c.category, p.published_at, p.content, p.description, p.profile, CONCAT(u.name, ' ', u.last_name) AS 'fullName' FROM posts AS p JOIN categories AS c ON p.category_id=c.category_id JOIN users AS u ON p.user_id=u.user_id WHERE p.post_id=?", [post_id]);
        const lastPosts = await pool.query("SELECT post_id, title FROM posts WHERE post_id!=? ORDER BY 1 LIMIT 5", [post_id]);
        res.render('pages/post_details', { title: postDetails.title, postDetails, lastPosts });
    }catch(error){
        console.log(error);
    }
};

module.exports = { indexController, aboutusController, historyController, postController,searchController, calendarController, getPostDetails };