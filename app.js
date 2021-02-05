//Configuracion inicial del proyecto
//Importaciones necesarias
const express = require('express');
const cors = require('cors');

//importando configuración de .env
require('dotenv').config();

const app = express();

//middlewares de express para permitir envios desde el frontend en formato json o urlencoded

app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );

//middleware que habilita las cors para peticiones de otros dominios
app.use( cors() );

//importando la configuración de la base de datos
require('./src/config/database');

//importando la configuración de las rutas
//todas las rutas que sean peticiones a la api se declararan de la siguiente manera -> /api/

//levantando en el servidor
app.listen( process.env.SERVER_PORT, () => {
    console.log(`Servidor escuchando el puerto: ${process.env.SERVER_PORT}`);
} )