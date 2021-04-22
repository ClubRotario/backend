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
        arr.forEach( element => {
            element.start = moment( element.start ).format("yyyy-MM-DD");
            element.end = moment( element.end, "yyyy-MM-DD" ).add(1, 'days');
        });
        console.log(arr);
        return JSON.stringify(arr); 
    },
    capitalize: function(string){
        return string.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
    },
    fromNumberToArray: function(number){
        let arr = [];
        for(let i = 1; i<=number; i++){
            arr.push(i);
        };
        return arr;
    },
    ifCurrentPage: function(a, b, opt){
        return (a==b+1)? opt.fn(this):opt.inverse(this);
    },
    prevNext: function(current, value){
        return parseInt(current) + parseInt(value);
    },
    isPost: function(a, opt){
        if(a){
            return (a.toLowerCase()=='post')? opt.fn(this):opt.inverse(this);
        }
    },
}