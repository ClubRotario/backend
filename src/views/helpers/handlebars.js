const moment=require('moment');
module.exports = {
    dateformat: function(date){
        return moment(date).format('DD/MM/yyyy');
    }
}