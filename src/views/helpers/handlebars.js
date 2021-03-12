const moment=require('moment');
module.exports = {
    dateformat: function(date){
        return moment(date).format('DD/MM/yyyy');
    },
    descriptionLength: function(description){
        return description.length > 50 ? `${description.substr(0, 47)}...`: description;
    }
}