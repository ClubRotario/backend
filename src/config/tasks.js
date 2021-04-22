const schedule = require('node-schedule');
const moment = require('moment');
const { sendEmail } = require('../helpers/sendEmail');

const job = schedule.scheduleJob("*/5 * * * *", function(fireDate){
    // sendEmail('Recordatorío', 'portillocastilloa@gmail.com');
}); 