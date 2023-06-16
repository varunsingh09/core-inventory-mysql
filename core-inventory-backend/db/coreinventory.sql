CREATE DATABASE IF NOT EXISTS coreinventory;

USE coreinventory;

CREATE TABLE users (
    id INT(11) NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    CONSTRAINT pk_users PRIMARY KEY (id)
)ENGINE=InnoDb;

CREATE TABLE categories (
    id INT(11) NOT NULL AUTO_INCREMENT,
    user_id INT(11) NOT NULL,
    name VARCHAR(50) NOT NULL,
    CONSTRAINT pk_categories PRIMARY KEY (id),
    CONSTRAINT fk_category_user FOREIGN KEY (user_id) REFERENCES users(id)
)ENGINE=InnoDb;

CREATE TABLE items (
	id INT(11) NOT NULL AUTO_INCREMENT,
    category_id INT(11),
    user_id INT(11) NOT NULL,
	name VARCHAR(50) NOT NULL,
    quantity INT(11) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    image_url VARCHAR(255) NOT NULL,    
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_items PRIMARY KEY (id),
    CONSTRAINT fk_item_category FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE SET NULL,
    CONSTRAINT fk_item_user FOREIGN KEY (user_id) REFERENCES users(id)
)ENGINE=InnoDb;

INSERT INTO users (id, name, password) VALUES (1, "admin", "admin");