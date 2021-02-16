const pool = require("../config/database");


//Obtener todos los posts
const getManyPosts = async(req, res) => {

    const totalPosts = await pool.query(`SELECT * FROM posts`);
    
    const  page  = req.params.page || 1;
    const limit = 4;
    let offset = (page - 1)*limit;
    const totalPages = Math.ceil( totalPosts.length/limit );
    let totalPagesArr = [];
    for( let i = 0; i < totalPages; i++ ){
        totalPagesArr.push(i+1);
    }

    const posts = await pool.query(`SELECT * FROM posts ORDER BY post_id DESC LIMIT ${limit} OFFSET ${offset}`);

    const pagination = {
        show: (totalPosts.length > 4)? true: false,
        totalPages: totalPagesArr,
        currentPage: page
    }
    return res.json({ posts, pagination });
}

//Ruta para guardar un post
const saveOnePost = async(req, res) => {
    const { title, user_id } = req.body;
    newPost = {
        user_id,
        title
    }
    const post = await pool.query(`INSERT INTO posts SET ?`, [newPost]);
    return res.json({ post });
};


module.exports = { saveOnePost, getManyPosts };