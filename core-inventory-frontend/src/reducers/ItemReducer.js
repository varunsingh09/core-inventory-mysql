import { actionTypes } from '../config/actionTypes';

const initialState = {    
    items: []
};

export const ItemReducer = (state = initialState, action) => {
    switch (action.type) {        
        case actionTypes.SET_ITEMS:
            return { ...state, items: action.items }
        case actionTypes.SET_ITEM:
            return { ...state, item: action.item }        
        default:
            return state;
    }
};