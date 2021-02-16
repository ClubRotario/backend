const { json } = require('express');
const multer = require('multer');
const path = require('path');

const imageStorage = multer.diskStorage({
    destination: function( req, file, cb ){
        cb( null, path.join( __dirname, '..', 'public', 'postsImages' ) );
    },
    filename: function(req, file, cb){
        cb( null, `${Date.now()}_${file.originalname}` );
    }
});

const imageUploader = multer({ storage: imageStorage }).any();

module.exports = { imageUploader };