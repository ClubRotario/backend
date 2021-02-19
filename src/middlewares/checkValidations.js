const { validationResult } = require('express-validator');

const checkValidations = (req, res, next) => {
    const result = validationResult(req).errors;
    if(result.length > 0){
        let errors = result.map( (value) => {
            return { message: value.msg }
        })
        return res.status(400).json(errors);
    }else{
        next();
    }
};


module.exports = { checkValidations };