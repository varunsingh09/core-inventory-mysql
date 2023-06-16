import { select, call, put, takeLatest } from 'redux-saga/effects';
import { reset, stopSubmit } from 'redux-form';
import CategoryProvider from '../providers/CategoryProvider';
import { setCategories, setCategory, getCategories } from '../../actions/categories';
import { setLoading, setSuccess, setError } from '../../actions/users';
import { actionTypes } from '../../config/actionTypes';

/*
    Each try clause has an if clause inside that evaluates whether or not 
    there's a session to make a call. This avoids screens with error messages from appearing
    to user.
*/

function* getCategoriesGenerator(action) {
    try {
        const session = yield select(state => state.UserReducer.session);
        if (session) {            
            const categories = yield call(CategoryProvider.getCategories);                 
            yield put(setCategories(categories));
            yield put(setLoading(false));
        }     
    } catch (error) {        
        console.log('Something\'s gone wrong:', error);                
        yield put(setCategories(null));  
        yield put(setLoading(false));      
    }
}

function* getCategoryGenerator(action) {
    try {
        const session = yield select(state => state.UserReducer.session);
        if (session) {
            const category = yield call(CategoryProvider.getCategory, action.id);        
            yield put(setCategory(category));            
        }                
    } catch (error) {
        console.log('Something\'s gone wrong:', error);
        yield put(setCategory(null));           
    }
}

function* createCategoryGenerator(action) {
    try {
        const session = yield select(state => state.UserReducer.session);
        if (session) {
            yield call(CategoryProvider.createCategory, action.data);
            yield put(getCategories);
            yield put(setError(null));
            yield put(setSuccess(`Category ${action.data.name} created`));        
            yield put(reset('CategoryForm'));
        }
    } catch (error) {
        yield put(stopSubmit('CategoryForm', error.response.data.error));
        yield put(setSuccess(null));
        yield put(setError(error.response.data.error));
        yield put(reset('CategoryForm'));
    }
}

function* updateCategoryGenerator(action) {
    try {
        const session = yield select(state => state.UserReducer.session);
        if (session) {
            yield call(CategoryProvider.updateCategory, action.id, action.data);
            yield put(getCategories);
            yield put(setError(null));
            yield put(setSuccess('Category updated'));        
            yield put(reset('CategoryForm'));
        }
    } catch (error) {
        yield put(stopSubmit('CategoryForm', error.response.data.error));
        yield put(setSuccess(null));
        yield put(setError(error.response.data.error));
        yield put(reset('CategoryForm'));       
    }
}

function* deleteCategoryGenerator(action) {
    try {
        const session = yield select(state => state.UserReducer.session);
        if (session) {
            yield call(CategoryProvider.deleteCategory, action.id);
            yield put(getCategories);
            yield put(setError(null));
            yield put(setSuccess('Category deleted')); 
            yield put(reset('CategoryForm'));
        }   
    } catch (error) {
        console.log('Something\'s gone wrong:', error);
        yield put(reset('CategoryForm'));        
    }
}

export function* categorySaga() {    
    yield takeLatest(actionTypes.GET_CATEGORIES, getCategoriesGenerator);
    yield takeLatest(actionTypes.GET_CATEGORY, getCategoryGenerator);    
    yield takeLatest(actionTypes.CREATE_CATEGORY, createCategoryGenerator);
    yield takeLatest(actionTypes.UPDATE_CATEGORY, updateCategoryGenerator);
    yield takeLatest(actionTypes.DELETE_CATEGROY, deleteCategoryGenerator);
}