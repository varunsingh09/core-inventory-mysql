const mysqlConnection = require('../database');

const categoriesController = {};

categoriesController.getCategories = (req, res) => {    
    const query = 'SELECT * FROM categories WHERE user_id = ? ORDER BY name ASC';    
    mysqlConnection.query(query, [req.userId], (error, rows, fields) => {
        if (!error) {
            if (rows.length > 0) {
                res.status(200).send(rows);                
            } else {                
                res.status(404).send({ error: 'No categories found' });
            }
        } else {
            console.log(error);            
        }
    });
};

categoriesController.getCategory = (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM categories WHERE id = ? AND user_id = ?';
    mysqlConnection.query(query, [id, req.userId], (error, rows, fields) => {
        if (!error) {
            if (rows.length > 0) {                
                res.status(200).send(rows[0]);
            } else {                
                res.status(404).send({ error: 'Category not found'});
            }
        } else {
            console.log(error);
            
        }
    });
};

categoriesController.createCategory = (req, res) => {    
    const { name } = req.body;
    if (name === undefined || name.trim().length === 0) {
        res.status(400).send({ 
            error: { name: 'Invalid name' }
        });
    } else {
        categoryNameExists(req.userId, name, exists => {
            if (!exists) {
                const query = 'INSERT INTO categories (user_id, name) VALUES (?, ?)';
                mysqlConnection.query(query, [req.userId, name], (error, rows, fields) => {
                    !error ? res.status(200).send({ status: 'Category added' }) : console.log(error);            
                });
            } else {
                res.status(409).send({
                    error: { name: 'Category name in use' }
                });
            }
        });    
    }
};

categoriesController.updateCategory = (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if (name === undefined || name.trim().length === 0) {
        res.status(400).send({ 
            error: { name: 'Invalid name.' }
        });
    } else {
        categoryNameExists(req.userId, name, exists => {
            if (!exists) {
                const query = 'UPDATE categories SET name = ? WHERE id = ? AND user_id = ?';
                mysqlConnection.query(query, [name, id, req.userId], (error, rows, fields) => {
                    if (!error) {                                        
                        if (rows.changedRows > 0) {                        
                            res.status(200).send({ status: 'Category updated' });
                        } else {
                            res.status(500).send({ error: 'Category not updated' });
                        }
                    } else {
                        console.log(error);            
                    }
                });
            } else {
                res.status(409).send({
                    error: { name: 'Category name in use' }
                });
            }    
        });    
    }
};

categoriesController.deleteCategory = (req, res) => {
    const { id } = req.params;    
    const query = 'DELETE FROM categories WHERE id = ? AND user_id = ?';
    mysqlConnection.query(query, [id, req.userId], (error, rows, fields) => {
        !error ? res.status(200).send({ status: 'Category deleted' }) : console.log(error);        
    });
};

module.exports = categoriesController;

const categoryNameExists = (userId, name, exists) => {    
    const compare =  name.localeCompare('Uncategorized', undefined, { sensitivity: 'base' });    
    if (compare === 0 ) {
        exists(true);
    } else {
        const query = 'SELECT * FROM categories WHERE user_id = ? AND name = ?';
        mysqlConnection.query(query, [userId, name], (error, rows, fields) => {
            if (!error) {
                if (rows.length > 0) {
                    exists(true);
                } else {
                    exists(false);
                }
            } else {
                console.log(error);                
            }
        });
    }    
};