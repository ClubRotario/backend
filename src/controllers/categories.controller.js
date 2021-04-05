const { request, response } = require('express');
const pool = require('../config/database');

const getAllCategories = async(req = request, res = response) => {
    try{
        const categories = await pool.query('SELECT * FROM categories');
        return res.json({ categories });
    }catch(error){
        console.log(error);
    }
};

const saveCategory = async(req, res) => {
    try{
        const category = req.body.category.toLowerCase();
        const existCategory = await pool.query('SELECT * FROM categories WHERE category=?', [category]);
        if( existCategory.length > 0 ){
            return res.status(400).json({ message: 'Ya existe una categoría con ese nombre' });
        }else{
            await pool.query('INSERT INTO categories SET ?', [{category}]);
            return res.json({ message: 'Categoría registrada correctamente' });
        }
    }catch(error){ 
        console.log(error);
    }
}

const deleteCategory = async(req = request, res = response) => {
    try{
        const {category_id} = req.query;
        const postsCat = await pool.query('SELECT * FROM posts WHERE category_id=?', [category_id]);
        if(postsCat.length > 0){
            return res.status(400).json({ message: 'Error, hay posts publicados con esta categoría, por favor cambia de categoría los posts para poder eliminar esta categoría' });
        }else{
            await pool.query('DELETE FROM categories WHERE category_id=?', [category_id]);
            return res.json({ message: 'Categoría eliminada correctamente' });
        }
    }catch(error){  
        console.log(error);
    }
};

const updateCategory = async(req = request, res = response) => {
    try{
        const { category_id } = req.body;
        const category = req.body.category.toLowerCase();
        const existCategory = await pool.query("SELECT * FROM categories WHERE category=?", [category]);
        if( existCategory.length > 0 ){
            return res.status(400).json({ message: 'Ya existe una categoría con ese nombre' });
        }else{
            await pool.query('UPDATE categories SET category=? WHERE category_id=?', [category, category_id]);
            return res.json({ message: 'Categoría actualizada correctamente' });
        }
    }catch(error){  
        console.log(error);
    }
};

module.exports = { getAllCategories, deleteCategory,updateCategory, saveCategory };