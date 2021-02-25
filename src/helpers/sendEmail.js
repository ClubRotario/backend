const nodemailer = require("nodemailer");

const pool = require('../config/database');

// async..await is not allowed in global scope, must use a wrapper
function sendEmail(subject, mail) {

    return new Promise( async(resolve, reject) => {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        //   let testAccount = await nodemailer.createTestAccount();
    
        const code = tokenGenerator(6);
        
     
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: process.env.HOST,
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL, // generated ethereal user
                pass: process.env.PASSWORD, // generated ethereal password
            },
        });
     
        try{
                    // send mail with defined transport object
            let info = await transporter.sendMail({
                from: process.env.EMAIL, // sender address
                to: mail, // list of receivers
                subject: subject, // Subject line
                html: `<h1>Tu código de verificación es: ${code}</h1>`, // html body
            });

            console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        
            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

            resolve(code);

        }catch(error){
            console.log(error);
            reject(error);
        }

    } );

}

function tokenGenerator(length) {
    var result           = '';
    var characters       = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

module.exports = { sendEmail };