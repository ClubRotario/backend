const pool = require("../config/database");

const generatePagination = async(total, page, query) => {
    return new Promise(async( resolve, reject ) => {
        try{
            const limit = 2;
            const offset = (page - 1)*limit;
            const numberPages = Math.ceil( total/ limit );
            const paginated = await pool.query(`${query} ORDER BY 1 DESC LIMIT ${limit} OFFSET ${offset}`);
            let totalArr = [];
            for(let i = 0; i < numberPages; i++){
                totalArr.push(i+1);
            }
            const pages = {
                show: numberPages > 1,
                current: page,
                total: totalArr,
                hasNext: page <  numberPages,
                hasPrev: page > 1
            }
            resolve( {paginated, pages} );
        }catch(error){
            reject(error);
        }
    });
};

module.exports = { generatePagination };