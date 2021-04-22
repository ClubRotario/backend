//Configuracion inicial del proyecto
//Importaciones necesarias
const express = require('express');
const cors = require('cors');
const hbs = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session');
const MysqlStore = require('express-mysql-session');
//importando configuración de .env
require('dotenv').config();

const app = express(); 
 
//Session
app.use( session({
    secret: 'mysqlnodesession',
    resave: false,
    saveUninitialized: false,
    store: new MysqlStore({
        database: process.env.DB_NAME,  
        host: process.env.DB_HOST,
        user: process.env.USER_DB,
        password: process.env.PASSWORD_DB
    })
}));

//Settings 
app.set('views', path.join( __dirname, "src", "views" ))
app.engine( '.hbs', hbs({
    defaultLayout: "main",
    layoutsDir: path.join( app.get('views'), 'layouts' ),
    partialsDir: path.join( app.get('views'), 'partials' ),
    extname: '.hbs',
    helpers: require(path.join( app.get('views'), 'helpers', 'handlebars' ))
}));
app.set( 'view engine', '.hbs' );

//middlewares de express para permitir envios desde el frontend en formato json o urlencoded
app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );
app.use( express.static( path.join(__dirname, 'src', 'public') ) );
app.use( cookieParser() );
//middleware que habilita las cors para peticiones de otros dominios
app.use( cors() );
app.use( flash() );
//Manejo de error de CSRF Token
app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err)
  
    // handle CSRF token errors here
    res.status(403)
    res.send('form tampered with')
});

//variables Globales
//Globals variables
app.use( (req, res, next) => {
    app.locals.success =  req.flash('success');
    app.locals.message =  req.flash('message');
    next();
});

//importando la configuración de la base de datos
require('./src/config/database');

//Importando comprobasion de correos automatica
require('./src/config/tasks');

//importando la configuración de las rutas
//todas las rutas que sean peticiones a la api se declararan de la siguiente manera -> /api/

app.use( '/api/posts', require('./src/routes/posts.routes') );
app.use( '/api/auth', require('./src/routes/auth.routes') );
app.use( '/api/users', require('./src/routes/users.routes') );
app.use( '/api/categories', require('./src/routes/categories.routes') );

//Rutas de la web
app.use('/', require('./src/routes/web.routes'));

//levantando en el servidor
app.listen( process.env.SERVER_PORT, () => {
    console.log(`Servidor escuchando el puerto: ${process.env.SERVER_PORT}`);
} )