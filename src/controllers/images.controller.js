const { request, response } = require('express');

const pool = require('../config/database');

const saveOneImage = async( req = request, res = response ) => {
    const [image] = req.files;
    const post_id = parseInt(req.get('postId'));
    console.log(image);
    const name = image.filename;
    newImage = {
        name,
        post_id
    }
    try{
        await pool.query("INSERT INTO images SET ?", [newImage]);
        return res.json({ url: `${process.env.DOMAIN}/postsImages/${name}` });
    }catch(error){
        console.log(error);
    }
};

module.exports = { saveOneImage };    