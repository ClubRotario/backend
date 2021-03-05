//Configuracion inicial del proyecto
//Importaciones necesarias
const express = require('express');
const cors = require('cors');
const hbs = require('express-handlebars');
const path = require('path');

//importando configuración de .env
require('dotenv').config();

const app = express();

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

//middleware que habilita las cors para peticiones de otros dominios
app.use( cors() );

//importando la configuración de la base de datos
require('./src/config/database');

//Importando comprobasion de correos automatica
require('./src/config/tasks');

//importando la configuración de las rutas
//todas las rutas que sean peticiones a la api se declararan de la siguiente manera -> /api/

app.use( '/api/posts', require('./src/routes/posts.routes') );
app.use( '/api/auth', require('./src/routes/auth.routes') );

//Rutas de la web
app.use('/', require('./src/routes/web.routes'));

//levantando en el servidor
app.listen( process.env.SERVER_PORT, () => {
    console.log(`Servidor escuchando el puerto: ${process.env.SERVER_PORT}`);
} )