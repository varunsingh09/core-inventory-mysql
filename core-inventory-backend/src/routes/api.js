const { Router } = require('express');
const api = Router();

//  Middlewares
const auth = require('../middlewares/auth');

//  Controllers
const { mainUser, logIn, signUp } = require('../controllers/users.controller');
const { getCategories, getCategory, createCategory, updateCategory, deleteCategory } = require('../controllers/categories.controller');
const { getItems, getItem, createItem, updateItem, updateItemQuantity, updateItemImage, deleteItem } = require('../controllers/items.controller');

//  Users routes
api.get('/main-user', auth.checkToken, mainUser);
api.post('/login', logIn);
api.post('/signup', signUp);

//  Categories routes
api.get('/categories', auth.checkToken, getCategories);
api.get('/categories/:id', auth.checkToken, getCategory);
api.post('/categories', auth.checkToken, createCategory);
api.patch('/categories/:id', auth.checkToken, updateCategory);
api.delete('/categories/:id', auth.checkToken, deleteCategory);

//  Items routes
api.get('/items', auth.checkToken, getItems);
api.get('/items/:id', auth.checkToken, getItem);
api.post('/items', auth.checkToken, createItem);
api.put('/items/:id', auth.checkToken, updateItem);
api.patch('/items/:id', auth.checkToken, updateItemQuantity);
api.patch('/items/:id', auth.checkToken, updateItemImage);
api.delete('/items/:id', auth.checkToken, deleteItem);

module.exports = api;