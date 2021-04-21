const pool = require("../config/database");
const moment = require('moment');
const fs = require('fs');
const path = require('path');

//Obtener todos los posts
const getManyPosts = async(req, res) => {

    const { owner } = req.query;

    const totalPosts = await pool.query(`SELECT * FROM posts ${req.isAdmin ? '': 'WHERE user_id=' + req.user_id } ${!owner ? '': 'WHERE user_id=' + req.user_id } ORDER BY 1 DESC`);
    
    const  page  = req.params.page || 1;
    const limit = 4;
    let offset = (page - 1)*limit;
    const totalPages = Math.ceil( totalPosts.length/limit );
    let totalPagesArr = [];
    for( let i = 0; i < totalPages; i++ ){ 
        totalPagesArr.push(i+1);
    }

    if(!owner){
        const posts = await pool.query(`SELECT * FROM posts ${req.isAdmin ? '': 'WHERE user_id=' + req.user_id } ORDER BY post_id DESC LIMIT ${limit} OFFSET ${offset}`);
        const pagination = {
            show: (totalPosts.length > 4)? true: false,
            totalPages: totalPagesArr,
            currentPage: page
        }
        return res.json({ posts, pagination });
    }else{
        return res.json({ posts: totalPosts });
    }

}

//Obtener un unico post
const getOnePost = async(req, res) => {
    try{
        const { id } = req.params;

        const [post] = await pool.query(`SELECT * FROM posts as p LEFT JOIN categories AS c ON c.category_id = p.category_id WHERE p.post_id=${id}`);

        const [entry] = await pool.query("SELECT * FROM entries WHERE post_id=?", [id]);
        if(entry){
            post.entry = true;
            post.start = entry.start;
            post.end = entry.end;
            post.address = entry.address;
        }

        const tags = await pool.query("SELECT tags.tag_id, tags.tag_content FROM posts_tags JOIN tags ON posts_tags.tag_id=tags.tag_id WHERE posts_tags.post_id=?",[post.post_id]);
        if(tags.length > 0){
            post.tags = tags;
        }

        return res.json({ post, postId: id });
    }catch(error){
        console.log(error);
    }
}

//Ruta para guardar un post
const saveOnePost = async(req, res) => {
    try{
        const { title, user_id } = req.body;
        newPost = {
            user_id,
            title
        }
        const post = await pool.query(`INSERT INTO posts SET ?`, [newPost]);
        return res.json({ post });
    }catch(error){
        console.log(error);
    }
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
        const { post_id, start, show, end, address } = req.body;

        if(show){
            await pool.query("INSERT INTO entries SET ?", [{ post_id, start, end, address }]);
        }else{
            await pool.query("DELETE FROM entries WHERE post_id=?", [post_id]);
        }

        return res.json({ message: 'Entrada modificada correctamente' });
        
    }catch(error){
        console.log(error);
    }
};

const updateEntryDate = async(req, res) => {
    try{
        const { date, post_id, type } = req.body;
        await pool.query(`UPDATE entries SET ${type} = '${date}' WHERE post_id='${post_id}'`);
    }catch(error){
        console.log(error);
    }
}

const updateEntryAddress = async(req, res) => {
    try{
        const { address, post_id } = req.body;
        await pool.query(`UPDATE entries SET address = '${address}' WHERE post_id = '${post_id}'`);
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

const addTag = async(req, res) => {
    try{
        const { post_id, tag_content } = req.body;
        const existTag = await pool.query("SELECT * FROM tags WHERE tag_content=?", [tag_content]);
        if(existTag.length > 0){
            const {tag_id} = existTag[0];
            const hasTag = await pool.query(`SELECT * FROM posts_tags WHERE tag_id='${tag_id}' AND post_id='${post_id}'`);
            if(hasTag.length === 0){
                await pool.query("INSERT INTO posts_tags SET ?", [{ tag_id, post_id }])
            }
        }else{
            const newTag = {
                tag_content
            };
            const { insertId } = await pool.query("INSERT INTO tags SET ?", [newTag]);
            await pool.query( "INSERT INTO posts_tags SET ?", [{ post_id, tag_id: insertId }]);
        }
        return res.json({ message: 'Tag registrado correctamente' });
    }catch(error){
        console.log(error);
    }
};

const deleteTag = async(req, res) => {
    try{
        const { tag_id } = req.params;
        await pool.query("DELETE from posts_tags WHERE tag_id=?", [tag_id]);
        await pool.query("DELETE from tags WHERE tag_id=?", [tag_id]);
        return res.json({ message: 'Tag eliminado correctamente' });
    }catch(error){
        console.log(error);
    }
};
 
const deletePost = async(req, res) => {
    try{
        const { id: post_id } = req.query;
        const isEntry = await pool.query("SELECT * FROM entries WHERE post_id=?", [post_id]);
        const images = await pool.query("SELECT name FROM images WHERE post_id=?",[post_id]);
        const profile = await pool.query("SELECT profile FROM posts WHERE post_id=?",[post_id]);
        images.forEach( (image) => {
            fs.unlinkSync(path.join(__dirname, '..', 'public', 'postsImages', image.name));
        })
        fs.unlinkSync(path.join(__dirname, '..', 'public', 'profiles', profile[0].profile));
        if(isEntry.length > 0){
            await pool.query("DELETE FROM entries WHERE post_id=?", [post_id]);
        }
        await pool.query("DELETE FROM images WHERE post_id=?", [post_id]);
        await pool.query("DELETE FROM posts_tags WHERE post_id=?", [post_id]);
        await pool.query("DELETE FROM posts WHERE post_id=?", [post_id]);
        return res.json({ message: 'Post eliminado correctamente' });
    }catch(error){
        console.log(error)
    }
};  

 
module.exports = { saveOnePost, getManyPosts, getOnePost, getManyCategories, updatePost, publishPost,updateProfile, saveAsEntrie, deleteTag, addTag, deletePost, updateEntryDate, updateEntryAddress };