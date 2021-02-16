const  { request, response } = require('express');

const indexController = (req = request, res = response) => {
    res.render('pages/index', { title: "Inicio" });
};

module.exports = { indexController };