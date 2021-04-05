const { request, response } = require('express');

const getProfile = async(req = request, res = response) => {
    try{
        const { user_id } = req;
        console.log(user_id);
    }catch(error){

    }
};

module.exports = { getProfile }