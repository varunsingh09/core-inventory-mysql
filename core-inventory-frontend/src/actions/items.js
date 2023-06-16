import { actionTypes } from '../config/actionTypes';

export const setItems = (items) => ({
    type: actionTypes.SET_ITEMS,
    items
});

export const setItem = (item) => ({
    type: actionTypes.SET_ITEM,
    item
});

export const getItems = (filter) => ({
    type: actionTypes.GET_ITEMS,
    filter
});

export const getItem = (id) => ({
    type: actionTypes.GET_ITEM,
    id
});

export const searchItem = (filter, name) => ({
    type: actionTypes.SEARCH_ITEM,
    filter,
    name
});

export const createItem = (data) => ({
    type: actionTypes.CREATE_ITEM,
    data
});

export const updateItem = (id, data) => ({
    type: actionTypes.UPDATE_ITEM,
    id,
    data
});

export const updateItemQuantity = (id, quantity) => ({
    type: actionTypes.UPDATE_ITEM_QUANTITY,
    id,
    quantity
});

export const updateItemImage = (id, data) => ({
    type: actionTypes.UPDATE_ITEM_IMAGE,
    id,
    data
});

export const deleteItem = (id) => ({
    type: actionTypes.DETELE_ITEM,
    id
});