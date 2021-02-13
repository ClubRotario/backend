const mysql = require('mysql');
const { promisify } = require('util');

const pool = mysql.createPool({ 
    database: process.env.DB_NAME,
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    port: process.env.DB_PORT
 });

pool.getConnection( (error, connection) => {
    if(error){
        console.log(error);
        return;
    }
    if(connection) connection.release();
    console.log('Conectado a la DB')
});

pool.query = promisify( pool.query );

module.exports = pool;