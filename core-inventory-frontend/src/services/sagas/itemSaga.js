import { select, call, put, takeLatest } from 'redux-saga/effects';
import { stopSubmit, clearSubmitErrors } from 'redux-form';
import ItemProvider from '../providers/ItemProvider';
import { setItems, setItem, getItems, getItem } from '../../actions/items';
import { setLoading, setSubmitting, setError } from '../../actions/users';
import { actionTypes } from '../../config/actionTypes';

/*
    Each try clause has an if clause inside that evaluates whether or not 
    there's a session to make a call. This avoids screens with error messages from appearing
    to user.
*/

function* getItemsGenerator(action) {
    try {                
        const session = yield select(state => state.UserReducer.session);
        if (session) {                        
            const items = yield call(ItemProvider.getItems, action.filter);
            items.forEach(item => {
                item.created = String(new Date(item.created));
                item.modified === '0000-00-00 00:00:00' ? item.modified = 'Not modified' : item.modified = String(new Date(item.modified));
            });
            yield put(setItems(items));
            yield put(setLoading(false));
        }       
    } catch (error) {
        console.log('Something\'s gone wrong:', error); 
        yield put(setItems(null));   
        yield put(setLoading(false));
    }
}

function* searchItemGenerator(action) {
    try {
        const session = yield select(state => state.UserReducer.session);
        if (session) {
            let filter = '';
            switch (action.filter) {
                case 'Uncategorized items':
                    filter = `showBy=uncategorized&itemName=${action.name}`;
                    break;
                case 'All items':
                    filter = `showBy=unfiltered&itemName=${action.name}`;
                    break;
                default:
                    filter = `showBy=category&categoryId=${action.filter}&itemName=${action.name}`;
                    break;
            }        
            const items = yield call(ItemProvider.getItems, filter);
            items.forEach(item => {
                item.created = String(new Date(item.created));
                item.modified === '0000-00-00 00:00:00' ? item.modified = 'Not modified' : item.modified = String(new Date(item.modified));
            });
            yield put(setItems(items));
        }
    } catch (error) {         
        yield put(setItems(null));           
    }
}

function* getItemGenerator(action) {
    try {                
        const session = yield select(state => state.UserReducer.session);
        if (session) {
            yield put(setLoading(true));
            const item = yield call(ItemProvider.getItem, action.id);
            item.created = String(new Date(item.created));
            item.modified === '0000-00-00 00:00:00' ? item.modified = 'Not modified' : item.modified = String(new Date(item.modified));
            yield put(setItem(item));            
            yield put(setLoading(false));            
        }       
    } catch (error) {
        console.log('Something\'s gone wrong:', error); 
        yield put(setItem(null));   
        yield put(setLoading(false)); 
    }
}

function* createItemGenerator(action) {
    try {
        const session = yield select(state => state.UserReducer.session);
        if (session) {      
            yield put(clearSubmitErrors('ItemForm'));
            yield put(setSubmitting(true));            
            let formData = new FormData();
            formData.append('file', action.data.file.file, action.data.file.name);
            formData.append('folder', 'core-inventory');
            formData.append('upload_preset', process.env.REACT_APP_IMAGES_UPLOAD_PRESET);
            const image = yield call(ItemProvider.uploadItemImage, formData);                                    
            action.data.imageURL = image.secure_url;
            const item = yield call(ItemProvider.createItem, action.data);                                                            
            yield put(getItems('showBy=unfiltered'));
            window.location = `/items/${item.id}`;          
        }
    } catch (error) {               
        yield put(setSubmitting(false));
        yield put(stopSubmit('ItemForm', error.response.data.error));        
        yield put(setError(error.response.data.error));        
    }
}

function* updateItemGenerator(action) {
    try {
        const session = yield select(state => state.UserReducer.session);        
        if (session) {            
            yield put(clearSubmitErrors('ItemForm'));
            yield put(setSubmitting(true));            
            yield call(ItemProvider.updateItem, action.id, action.data);                           
            window.location = `/items/${action.id}`;
        }
    } catch (error) {
        // If there's no changes, just redirect to item details.
        if (error.response.status === 500) {
            window.location = `/items/${action.id}`;
        } else {
            yield put(setSubmitting(false));
            yield put(stopSubmit('ItemForm', error.response.data.error));            
            yield put(setError(error.response.data.error));        
        }        
    }
}

function* updateItemQuantityGenerator(action) {
    try {
        const session = yield select(state => state.UserReducer.session);        
        if (session) {            
            yield put(setLoading(true));
            const data = {
                quantity: action.quantity
            }
            yield call(ItemProvider.updateItemQuantity, action.id, data);
            yield put(getItem(action.id));
            yield put(setLoading(false));
        }
    } catch (error) {
        yield put(setLoading(false));        
        console.log('Something\'s gone wrong:', error);
    }
}

function* updateItemImageGenerator(action) {
    try {
        const session = yield select(state => state.UserReducer.session);        
        if (session) {       
            yield put(clearSubmitErrors('ItemForm'));     
            yield put(setSubmitting(true));            
            let formData = new FormData();              
            formData.append('image', action.data.file, action.data.name);  
            const image = yield call(ItemProvider.uploadItemImage, formData);  
            const data = {
                imageURL: image.secure_url
            }                    
            yield call(ItemProvider.updateItemImage, action.id, data);
        }
    } catch (error) {
        yield put(setSubmitting(false));
        yield put(stopSubmit('ItemForm', error.response.data.error));        
        yield put(setError(error.response.data.error));        
    }
}

function* deleteItemGenerator(action) {
    try {
        const session = yield select(state => state.UserReducer.session);
        if (session) {
            yield put(setLoading(true));            
            yield call(ItemProvider.deleteItem, action.id);
            yield put(setItem(null));
            window.location = '/inventory';            
        }
    } catch (error) {
        console.log('Something\'s gone wrong:', error);
    }
}

export function* itemSaga() {    
    yield takeLatest(actionTypes.GET_ITEMS, getItemsGenerator);
    yield takeLatest(actionTypes.SEARCH_ITEM, searchItemGenerator);
    yield takeLatest(actionTypes.GET_ITEM, getItemGenerator);
    yield takeLatest(actionTypes.CREATE_ITEM, createItemGenerator);    
    yield takeLatest(actionTypes.UPDATE_ITEM, updateItemGenerator);
    yield takeLatest(actionTypes.UPDATE_ITEM_QUANTITY, updateItemQuantityGenerator);
    yield takeLatest(actionTypes.UPDATE_ITEM_IMAGE, updateItemImageGenerator);
    yield takeLatest(actionTypes.DETELE_ITEM, deleteItemGenerator);
};