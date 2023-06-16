const mysqlConnection = require('../database');

const itemsController = {};

itemsController.getItems = (req, res) => {        
    let query = '';    
    const { showBy, itemName } = req.query;
    //  If there's itemName it means user is requesting items by search bar.
    switch (showBy) {
        case 'category':
            const { categoryId } = req.query;
            if (itemName) {
                query = `SELECT * FROM items WHERE category_id = ? AND user_id = ? AND name REGEXP '${itemName}' ORDER BY name ASC`
            } else {
                query = 'SELECT * FROM items WHERE category_id = ? AND user_id = ? ORDER BY name ASC';
            }            
            queryHasCategoryId(categoryId, query, req, res);                                    
            break;
        case 'uncategorized':
            if (itemName) {
                query = `SELECT * FROM items WHERE category_id IS NULL AND user_id = ? AND name REGEXP '${itemName}' ORDER BY name ASC`;
            } else {
                query = 'SELECT * FROM items WHERE category_id IS NULL AND user_id = ? ORDER BY name ASC';
            }            
            queryHasCategoryId('', query, req, res);
            break;
        case 'unfiltered':
            if (itemName) {
                query = `SELECT * FROM items WHERE user_id = ? AND name REGEXP '${itemName}' ORDER BY name ASC`;
            } else {
                query = 'SELECT * FROM items WHERE user_id = ? ORDER BY name ASC';                
            }            
            queryHasCategoryId('', query, req, res);
            break;
    }    
};

itemsController.getItem = (req, res) => {    
    const { id } = req.params;
    const query = 'SELECT * FROM items WHERE id = ? AND user_id = ?';    
    mysqlConnection.query(query, [id, req.userId], (error, rows, fields) => {
        if (!error) {
            if (rows.length > 0) {  
                res.status(200).send(rows[0]);                                            
            } else {                                            
                res.status(404).send({ status: 'Item not found' });
            }
        } else {
            console.log(error);            
        }       
    });
};

itemsController.createItem = (req, res) => {               
    let { categoryId, name, quantity, unit, imageURL } = req.body;    
    categoryId = !categoryId || categoryId === NaN || categoryId === 'NULL' ? null : parseInt(categoryId);
    quantity = parseInt(quantity);     
    itemNameExists(categoryId, req.userId, name, exists => {
        if (!exists) {                                           
            const query = 'INSERT INTO items (category_id, user_id, name, quantity, unit, image_url) VALUES (?, ?, ?, ?, ?, ?)';
            mysqlConnection.query(query, [categoryId, req.userId, name, quantity, unit, imageURL], (error, rows, fields) => {
                !error ? res.status(200).send({ status: 'Item added', id: rows.insertId }) : console.log(error);        
            });        
        } else { 
            if (!categoryId) {
                res.status(409).send({ 
                    error: { name: 'Item name in use in Uncategorized' }
                });
            }
            getCategoryName(categoryId, req.userId, categoryName => {
                res.status(409).send({                    
                    error: { name: `Item name in use in category "${categoryName}"` }
                });
            });
        }  
    });    
};

itemsController.updateItem = (req, res) => {    
    const { id } = req.params;
    let { categoryId, name, nameIsEquals, quantity, unit } = req.body;       
    categoryId = categoryId === 'NaN' || categoryId === 'NULL' ? null : categoryId;        
    let query = '';    
    if (nameIsEquals) {
        query = 'UPDATE items SET category_id = ?, quantity = ?, unit = ? WHERE id = ? AND user_id = ?';
        mysqlConnection.query(query, [categoryId, quantity, unit, id, req.userId], (error, rows, fields) => {        
            if (!error) {
                if (rows.changedRows > 0) {
                    res.status(200).send({ status: 'Item updated' });                        
                } else {                        
                    res.status(500).send({ status: 'No changes' });
                }
            } else {
                console.log(error);            
            }           
        });            
    } else {
        itemNameExists(categoryId, req.userId, name, exists => {
            if (!exists) {                                  
                query = 'UPDATE items SET category_id = ?, name = ?, quantity = ?, unit = ? WHERE id = ? AND user_id = ?';
                mysqlConnection.query(query, [categoryId, name, quantity, unit, id, req.userId], (error, rows, fields) => {        
                    if (!error) {
                        if (rows.changedRows > 0) {
                            res.status(200).send({ status: 'Item updated' });                        
                        } else {                        
                            res.status(500).send({ status: 'No changes' });
                        }
                    } else {
                        console.log(error);            
                    }           
                });
            } else {
                if (!categoryId) {
                    res.status(409).send({                    
                        error: { name: 'Item name in use in Uncategorized' }
                    });
                } else {
                    getCategoryName(categoryId, req.userId, categoryName => {
                        res.status(409).send({                    
                            error: { name: `Item name in use in category "${categoryName}"` }
                        });
                    });                                
                }
            }
        });             
    }    
};

itemsController.updateItemQuantity = (req, res) => {    
    const { id } = req.params;        
    const { quantity } = req.body;
    const query = 'UPDATE items SET quantity = ? WHERE id = ? AND user_id = ?';
    mysqlConnection.query(query, [quantity, id, req.userId], (error, rows, fields) => {        
        if (!error) {            
            if (rows.changedRows > 0) {                
                res.status(200).send({ status: 'Item quantity updated' });
            } else {                
                res.status(500).send({ status: 'No changes' });
            }
        } else {
            console.log(error);            
        }           
    });
};

itemsController.updateItemImage = (req, res) => {        
    const { id } = req.params;
    const { imageURL } = req.body;
    const query = 'UPDATE items SET image_url = ? WHERE id = ? AND user_id = ?';
    mysqlConnection.query(query, [imageURL, id, req.userId], (error, rows, fields) => {
        if (!error) {
            if (rows.changedRows > 0) {
                res.status(200).send({ status: 'Item image updated' });                    
            } else {                    
                res.status(500).send({ status: 'No changes' });
            }
        } else {
            console.log(error);                    
        }
    }); 
};

itemsController.deleteItem = (req, res) => {
    const { id } = req.params;    
    const query = 'DELETE FROM items WHERE id = ? AND user_id = ?';
    mysqlConnection.query(query, [id, req.userId], (error, rows, fields) => {
        !error ? res.status(200).send({ status: 'Item deleted' }) : console.log(error);        
    });
};

module.exports = itemsController;

const itemNameExists = (categoryId, userId, name, exists) => {    
    let query = '';
    if (!categoryId) {
        query = 'SELECT * FROM items WHERE category_id IS NULL AND user_id = ? AND name = ?';
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
    } else {
        query = 'SELECT * FROM items WHERE category_id = ? AND user_id = ? AND name = ?';
        mysqlConnection.query(query, [categoryId, userId, name], (error, rows, fields) => {
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

const queryHasCategoryId = (categoryId, query, req, res) => {                
    if (categoryId !== '') {        
        mysqlConnection.query(query, [categoryId, req.userId], (error, rows, fields) => {                                               
            if (!error) {
                if (rows.length > 0) {                
                    res.status(200).send(rows);
                } else {                                                        
                    res.status(404).send({ error: 'No items found' });
                }
            } else {
                console.log(error);            
            }       
        });
    } else {        
        mysqlConnection.query(query, [req.userId], (error, rows, fields) => {                       
            if (!error) {
                if (rows.length > 0) {                
                    res.status(200).send(rows);
                } else {                
                    res.status(404).send({ error: 'No items found' });
                }
            } else {
                console.log(error);            
            }       
        });
    }
};

const getCategoryName = (categoryId, userId, categoryName) => {    
    const query = 'SELECT * FROM categories WHERE id = ? AND user_id = ?';
    mysqlConnection.query(query, [categoryId, userId], (error, rows, fields) => {
        if (!error) {
            if (rows.length > 0) {                                                
                categoryName(rows[0].name);
            }
        } else {
            console.log(error);            
        }
    });       
};