const schedule = require('node-schedule');
const moment = require('moment');

const job = schedule.scheduleJob("00 00 00 * * *", function(fireDate){
    console.log('This job was supposed to run at ' + fireDate + ', but actually ran at ' + new Date());
});