const moment = require('moment');
module.exports = {
    dateformat: function(date){
        moment.locale('es');
        return moment(date).format("dddd, DD MMMM yyyy");
    },
    descriptionLength: function(description){
        return description.length > 70 ? `${description.substr(0, 67)}...`: description;
    },
    titleLength: function( title ){
        return title.length > 35 ? `${title.substr(0, 33)}...`: title;
    },
    json: function(arr){; 
        return JSON.stringify(arr); 
    },
    capitalize: function(string){
        return string.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
    }
}