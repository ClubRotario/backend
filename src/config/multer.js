const { json } = require('express');
const multer = require('multer');
const path = require('path');

const imageStorage = multer.diskStorage({
    destination: function( req, file, cb ){
        cb( null, path.join( __dirname, '..', 'public', 'postsImages' ) );
    },
    filename: function(req, file, cb){
        cb( null, `${Date.now()}_${file.originalname.substr(-10)}` );
    }
});

const profileStorage = multer.diskStorage({
    destination: function( req, file, cb ){
        cb( null, path.join( __dirname, '..', 'public', 'profiles' ) );
    },
    filename: function(req, file, cb){
        cb( null, `${Date.now()}_${file.originalname.substr(-10)}` );
    }
});

const imageUploader = multer({ storage: imageStorage }).any();
const profileUpload = multer({ storage: profileStorage }).single('profile');

module.exports = { imageUploader, profileUpload };