const pool = require("../config/database");
const moment = require('moment');

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

//Obtener un unico post
const getOnePost = async(req, res) => {
    const { id } = req.params;

    const post = await pool.query(`SELECT * FROM posts as p JOIN categories AS c ON c.category_id = p.category_id LEFT JOIN posts_tags AS pt ON p.post_id = pt.post_id WHERE p.post_id=${id}`);

    console.log(post);

    return res.json({ post: post[0], postId: id });
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

//Ruta para actualizar el contenido del post
const updatePost = async(req, res) => {
    try{
        const { postId: post_id, post: { category_id, content, description, title }, updated_at } = req.body;

        const newPost = {
            content,
            description,
            title, 
            category_id,
            updated_at: moment( updated_at ).format("YYYY-MM-DD hh:mm:ss")
        }
        console.log(newPost);

        await pool.query("UPDATE posts SET ? WHERE post_id=?", [newPost, post_id]);

        return res.json({ ok: true });

    }catch(error){
        console.log(error);
    }
};

//Publicar el post
const publishPost = async(req, res) => {
    try{
        const { post_id, published } = req.body;
        await pool.query( "UPDATE posts SET published=? WHERE post_id=?", [published, post_id] );
        return res.json({ ok: true });
    }catch(error){
        console.log(error);
    }
};

//Obtener categorias del post 
const getManyCategories = async(req, res) => {
    try{
        const categories = await pool.query("SELECT * FROM categories");
        return res.json({ categories });
    }catch( error ){
        console.log('error', error);
    }
};

 
module.exports = { saveOnePost, getManyPosts, getOnePost, getManyCategories, updatePost, publishPost };