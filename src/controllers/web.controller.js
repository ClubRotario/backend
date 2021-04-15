const  { request, response } = require('express');
const { generatePagination } = require('../helpers/pagination');
const pool = require('../config/database');

const indexController = async(req = request, res = response) => {
    const posts = await pool.query(`SELECT P.post_id, P.profile, P.title, P.published_at, P.description, C.category, CONCAT(u.name, ' ', u.last_name) AS 'author'
    FROM posts as P       
    JOIN categories as C ON P.category_id = C.category_id
    JOIN users AS u ON p.user_id=u.user_id
    WHERE P.published = 1
    AND NOT EXISTS (SELECT * FROM entries WHERE p.post_id=entries.post_id)
    ORDER BY 1 DESC limit 3`);
    const meta = {
        description: 'Club rotario de la ciudad de La Paz, Honduras',
        title: 'Rotary Club La Paz',
        image: `${process.env.DOMAIN}/img/rotary_club-logo.png`,
    }
    res.render('pages/index', { header:{ title: "Inicio" }, posts, meta });
};

const aboutusController = (req = request, res = response) => {
    const meta = {
        description: 'Club rotario de la ciudad de La Paz, Honduras',
        title: `Acerca de Nosotros | Rotary Club La Paz`,
        image: `${process.env.DOMAIN}/img/rotary_club-logo.png`,
    }
    const header = {
        title: 'Acerca de Nosotros'
    }
    return res.render('pages/aboutus', { meta, header } );
};

const historyController = (req = request, res = response) => {
    const meta = {
        description: 'Club rotario de la ciudad de La Paz, Honduras',
        title: `Historia | Rotary Club La Paz`,
        image: `${process.env.DOMAIN}/img/rotary_club-logo.png`,
    }
    const header = {
        title: 'Nuestra Historia'
    }
    return res.render('pages/history', { header, meta });
};

const postController = async(req = request, res = response) => {
    const page = req.query.page || 1;
    const consult = 'SELECT post_id, title, published_at, description, profile FROM posts WHERE NOT EXISTS (SELECT * FROM entries WHERE posts.post_id=entries.post_id) AND published=1';
    const entries = await pool.query('SELECT e.post_id, p.title, e.start, e.end, e.address FROM entries AS e JOIN posts AS p ON e.post_id=p.post_id ORDER BY 1 DESC LIMIT 5');
    const totalPost = await pool.query(consult);
    const { paginated: results, pages } = await generatePagination( totalPost.length, page, consult );
    const meta = {
        description: 'Club rotario de la ciudad de La Paz, Honduras',
        title: `Todos los Posts`,
        image: `${process.env.DOMAIN}/img/rotary_club-logo.png`,
    }
    const header = {
        title: `Posts`
    }

    return res.render('pages/posts', { results, pages, meta, header, entries });
};

const searchController = async(req = request, res = response) => {
    const {query} = req.query
    const page = req.query.page || 1;
    const consult = `SELECT post_id, title, published_at, description, profile FROM posts WHERE published AND (description like '%${query}%' or title like '%${query}%')`;
    const totalPost = await pool.query(consult);
    const entries = await pool.query(`SELECT entries.post_id FROM entries JOIN posts ON entries.post_id=posts.post_id WHERE (posts.description like '%${query}%' or posts.title like '%${query}%')`);
    const { paginated: results, pages } = await generatePagination( totalPost.length, page, consult );
    results.forEach( (page) => {
        for(let i = 0; i < entries.length; i++){
            if(page.post_id == entries[i].post_id){
                page.type='AGENDA';
            }else{
                page.type='POST';
            }
        }
    });
    const meta = {
        description: 'Club rotario de la ciudad de La Paz, Honduras',
        title: `Rotary Club La Paz | busqueda ${query}`,
        image: `${process.env.DOMAIN}/img/rotary_club-logo.png`,
    }
    const header = {
        title: `busqueda: ${query}`
    }
    return res.render('pages/search', { results, query, pages, meta, header });
};

const calendarController = async(req = request, res = response) => {
    try{
        const events = await pool.query("SELECT p.title AS 'title', e.post_id, e.start, e.end FROM entries AS e JOIN posts AS p ON e.post_id=p.post_id");
        const meta = {
            description: 'Club rotario de la ciudad de La Paz, Honduras',
            title: `Calendario`,
            image: `${process.env.DOMAIN}/img/rotary_club-logo.png`,
        }
        const header = {
            title: 'Calendario'
        };
           
        return res.render('pages/calendar', { events, meta, header });
    }catch(error){
        console.log(error);
    }
};

const getPostDetails = async(req = request, res = response) => {
    try{
        const { post_id } = req.params;
        const [postDetails] = await pool.query("SELECT p.title, c.category, p.published_at, p.content, p.description, p.profile, CONCAT(u.name, ' ', u.last_name) AS 'fullName' FROM posts AS p JOIN categories AS c ON p.category_id=c.category_id JOIN users AS u ON p.user_id=u.user_id WHERE p.post_id=?", [post_id]);
        const lastPosts = await pool.query("SELECT post_id, title FROM posts WHERE post_id!=? ORDER BY 1 LIMIT 5", [post_id]);
        const meta = {
            description: postDetails.description,
            title: postDetails.title,
            image: `${process.env.DOMAIN}/img/rotary_club-logo.png`,
        }
        const header = {
            title: 'Calendario'
        };
        res.render('pages/post_details', { title: postDetails.title, postDetails, lastPosts, meta, header });
    }catch(error){
        console.log(error);
    }
};

module.exports = { indexController, aboutusController, historyController, postController,searchController, calendarController, getPostDetails };