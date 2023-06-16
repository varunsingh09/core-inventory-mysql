import { actionTypes } from '../config/actionTypes';

/* 
    - loading: Refers to the loader showed before the page completely loads.
    - submitting: Refers to the loader showed while the forms are submitting.
    - pathname: Refers to current page pathname.
*/

const initialState = {
    loading: true,
    submitting: false,
    pathname: '/'
};

export const UserReducer = (state = initialState, action) => {
    switch (action.type) {        
        case actionTypes.SET_SESSION:
            return { ...state, session: action.session }       
        case actionTypes.SET_LOADING:
            return { ...state, loading: action.loading }
        case actionTypes.SET_SUBMITTING:
            return { ...state, submitting: action.submitting }
        case actionTypes.SET_PATHNAME:
            return { ...state, pathname: action.pathname }
        case actionTypes.SET_SUCCESS:
            return { ...state, success: action.success }       
        case actionTypes.SET_ERROR:
            return { ...state, error: action.error }                   
        default:
            return state;
    }
};