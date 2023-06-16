import { actionTypes } from '../config/actionTypes';

export const setCategories = (categories) => ({
    type: actionTypes.SET_CATEGORIES,
    categories
});

export const setCategory = (category) => ({
    type: actionTypes.SET_CATEGORY,
    category
});

export const getCategories = {
    type: actionTypes.GET_CATEGORIES
};

export const getCategory = (id) => ({
    type: actionTypes.GET_CATEGORY,
    id
});

export const createCategory = (data) => ({
    type: actionTypes.CREATE_CATEGORY,
    data
});

export const updateCategory = (id, data) => ({
    type: actionTypes.UPDATE_CATEGORY,
    id,
    data
});

export const deleteCategory = (id) => ({
    type: actionTypes.DELETE_CATEGROY,
    id
});