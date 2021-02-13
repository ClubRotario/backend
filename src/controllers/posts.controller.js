const connection = require("../config/database");


const getManyPosts = (req, res) => {
    const postId = req.params.id;
    console.log(postId);
    connection.query( `SELECT * FROM posts where post_id='${postId}'`, ( error, results ) => {
        if(error){
            console.log(error);
            return;
        }
        console.log(results);
        return res.json(results);
    } )
};

//Ruta para guardar un post
const saveOnePost = (req, res) => {
    const { title, content } = req.body;
    connection.query( `INSERT INTO posts(user_id, category_id, title, content) VALUES(2, 1,'${title}', '${content}')`, (error, result) => {
        if(error){
            return res.status(400).json({ ok: false, error });
        }
        return res.json({ ok: true, result });
    } );
};


module.exports = { saveOnePost, getManyPosts };