const mysqlConnection = require('../database');

const deleteItemsAndCategories = () => {
    const query = `DELETE FROM items WHERE user_id = 1;
                   DELETE FROM categories WHERE user_id = 1`;
    mysqlConnection.query(query, (error, rows, fields) => {
        if (error) console.log(error);        
    });
};

const createTestInventory = () => {
    const query = 
    `INSERT INTO categories (id, user_id, name) VALUES
	(1, 1, "Appliances"),
	(2, 1, "Phones"),
	(3, 1, "Notebooks"),
	(4, 1, "Clothing"),
	(5, 1, "Instruments");
	INSERT INTO items (id, category_id, user_id, name, quantity, unit, image_url) VALUES
	(1, 1, 1, "Stove", 50, "unit(s)", "https://res.cloudinary.com/dxjc7e5te/image/upload/v1627839740/core-inventory/default/Stove_zbgmjr.jpg"),
	(2, 1, 1, "Washing Machine", 20, "unit(s)", "https://res.cloudinary.com/dxjc7e5te/image/upload/v1627839739/core-inventory/default/Washing_Machine_xudbyu.jpg"),
	(3, 1, 1, "Blender", 30, "unit(s)", "https://res.cloudinary.com/dxjc7e5te/image/upload/v1627839739/core-inventory/default/Blender_frsmoe.jpg"),
	(4, 2, 1, "iPhone", 17, "unit(s)", "https://res.cloudinary.com/dxjc7e5te/image/upload/v1627839739/core-inventory/default/iPhone_urlrbk.jpg"),
	(5, 2, 1, "Samsung Galaxy", 18, "unit(s)", "https://res.cloudinary.com/dxjc7e5te/image/upload/v1627839740/core-inventory/default/Samsung_Galaxy_p7lju4.jpg"),
	(6, 2, 1, "Xiamoi", 14, "unit(s)", "https://res.cloudinary.com/dxjc7e5te/image/upload/v1627839739/core-inventory/default/Xiaomi_opool2.jpg"),
	(7, 3, 1, "HP Laptop", 19, "unit(s)", "https://res.cloudinary.com/dxjc7e5te/image/upload/v1627839739/core-inventory/default/HP_Laptop_kg3aw8.png"),
	(8, 3, 1, "MacBook", 9, "unit(s)", "https://res.cloudinary.com/dxjc7e5te/image/upload/v1627840042/core-inventory/default/MacBook_xi41uu.jpg"),
	(9, 3, 1, "Lenovo Laptop", 12, "unit(s)", "https://res.cloudinary.com/dxjc7e5te/image/upload/v1627839740/core-inventory/default/Lenovo_Laptop_o4ydqb.jpg"),
	(10, 4, 1, "Hoodie", 25, "unit(s)", "https://res.cloudinary.com/dxjc7e5te/image/upload/v1627839739/core-inventory/default/Hoodie_v3s4s8.jpg"),
	(11, 4, 1, "Sneakers", 27, "pair(s)", "https://res.cloudinary.com/dxjc7e5te/image/upload/v1627839740/core-inventory/default/Sneakers_tb2cfc.jpg"),
	(12, 4, 1, "Cap", 18, "unit(s)", "https://res.cloudinary.com/dxjc7e5te/image/upload/v1627839739/core-inventory/default/Cap_ypjsub.jpg"),
	(13, 5, 1, "Electric Guitar", 15, "unit(s)", "https://res.cloudinary.com/dxjc7e5te/image/upload/v1627839740/core-inventory/default/Electric_Guitar_qqzkuo.jpg"),
	(14, 5, 1, "Piano", 10, "unit(s)", "https://res.cloudinary.com/dxjc7e5te/image/upload/v1627839740/core-inventory/default/Piano_ra4awq.png"),
	(15, 5, 1, "Trumpet", 14, "unit(s)", "https://res.cloudinary.com/dxjc7e5te/image/upload/v1627839739/core-inventory/default/Trumpet_xpe38q.jpg"),
	(16, NULL, 1, "Telescope", 17, "unit(s)", "https://res.cloudinary.com/dxjc7e5te/image/upload/v1627839739/core-inventory/default/Telescope_alskc0.jpg"),
	(17, NULL, 1, "Hose", 11, "unit(s)", "https://res.cloudinary.com/dxjc7e5te/image/upload/v1627839739/core-inventory/default/Hose_lgojhi.jpg"),
    (18, NULL, 1, "Chair", 48, "unit(s)", "https://res.cloudinary.com/dxjc7e5te/image/upload/v1627839739/core-inventory/default/Chair_nthhgh.jpg")`
    mysqlConnection.query(query, (error, rows, fields) => {
        if (error) console.log(error);        
    });
};

const defaultInventory = () => {
    /*
        For user_id = 1 (testuser):
        If there's no categories or items, create test inventory.
        Otherwise, delete all items and categories and create test inventory.
    */
    const query = `SELECT COUNT(*) FROM categories WHERE user_id = 1;
                   SELECT COUNT(*) FROM items WHERE user_id = 1`;
    mysqlConnection.query(query, (error, rows, fields) => {
        if (!error) {
            categoriesRows = rows[0];
            itemsRows = rows[1];
            if (categoriesRows.length > 0 || itemsRows.length > 0) {
                deleteItemsAndCategories();
            }
            createTestInventory();
        } else {
            console.log(error);            
        }
    });
};

module.exports = defaultInventory;