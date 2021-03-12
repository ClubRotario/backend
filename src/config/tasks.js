const schedule = require('node-schedule');
const moment = require('moment');

const job = schedule.scheduleJob("00 00 * * * *", function(fireDate){
    console.log(`Ejectado a las: ${fireDate}`);
}); 