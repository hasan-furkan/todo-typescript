/*
 # ┌────────────── second (optional)
 # │ ┌──────────── minute
 # │ │ ┌────────── hour
 # │ │ │ ┌──────── day of month
 # │ │ │ │ ┌────── month
 # │ │ │ │ │ ┌──── day of week
 # │ │ │ │ │ │
 # │ │ │ │ │ │
 # * * * * * *
*/


const cron = require('node-cron');

const everyMinutes = cron.schedule('* * * * *', () => {
    console.log("**********************")
    console.log('Running every minute.', new Date());
});

const everyFiveMinutes = cron.schedule('*/5 * * * *', () => {
    console.log("**********************")
    console.log('Running every five minutes.', new Date());
});

module.exports = { everyMinutes, everyFiveMinutes };