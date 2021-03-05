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
    try{
        const { id } = req.params;

        const [post] = await pool.query(`SELECT * FROM posts as p JOIN categories AS c ON c.category_id = p.category_id LEFT JOIN posts_tags AS pt ON p.post_id = pt.post_id WHERE p.post_id=${id}`);
        

        const [entry] = await pool.query("SELECT * FROM entries WHERE post_id=?", [id]);
        if(entry){
            post.entry = true;
            post.entry_date = entry.entry_date;
        }

        console.log(post);

        
        return res.json({ post, postId: id });
    }catch(error){
        console.log(error);
    }
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

const updateProfile = async(req, res) => {
    try{
        const { file } = req;
        const { post_id, updated_at } = req.body;
        newProfile = {
            profile: file.filename,
            updated_at
        }
        await pool.query("UPDATE posts SET ? WHERE post_id=?", [newProfile, post_id])
        console.log(newProfile);
        return res.json({ url: `${process.env.DOMAIN}/profiles/${file.filename}` });
    }catch(error){
        console.log(error);
    }
}

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

const saveAsEntrie = async(req, res) => {
    try{
        const { post_id,  entry_date, show} = req.body;

        if(show){
            await pool.query("INSERT INTO entries SET ?", [{ post_id, entry_date }]);
        }else{
            await pool.query("DELETE FROM entries WHERE post_id=?", [post_id]);
        }

        return res.json({ message: 'Entrada modificada correctamente' });
        
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

 
module.exports = { saveOnePost, getManyPosts, getOnePost, getManyCategories, updatePost, publishPost,updateProfile, saveAsEntrie };