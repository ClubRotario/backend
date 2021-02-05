const mysql = require('mysql');

const connection = mysql.createConnection({ 
    database: process.env.DB_NAME,
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    port: process.env.DB_PORT
 });

 connection.connect((error) => {
    if(error){
        console.log(`Se produjo un error al momento de conectarse a la base de datos, error: ${error}`);
        return;
    }
    console.log(`Conectado a la base de datos`);
 });