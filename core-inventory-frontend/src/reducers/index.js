import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { UserReducer } from './UserReducer';
import { CategoryReducer } from './CategoryReducer';
import { ItemReducer } from './ItemReducer';
import { actionTypes } from '../config/actionTypes';

const appReducers = combineReducers({
    form,
    UserReducer,
    CategoryReducer,
    ItemReducer
});

const mainReducer = (state, action) => {
    if (action.type === actionTypes.LOG_OUT) {
        state = undefined;
    }        
    return appReducers(state, action);
};

export default mainReducer;