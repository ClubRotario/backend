const { request, response } = require('express');

const saveOneImage = async( req = request, res = response ) => {
    const image = req.files;
    console.log(image);
    return res.json({ url: `${process.env.DOMAIN}/postsImages/${image[0].filename}` });
};

module.exports = { saveOneImage };