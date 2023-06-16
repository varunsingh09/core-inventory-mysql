import { call, put, takeLatest } from 'redux-saga/effects';
import { stopSubmit } from 'redux-form';
import UserProvider from '../providers/UserProvider';
import { setSession, setPathname, setSubmitting } from '../../actions/users';
import { actionTypes } from '../../config/actionTypes';

function* logInGenerator(action) {
    try {                
        yield put(setSubmitting(true));
        const session = yield call(UserProvider.logIn, action.data);
        window.localStorage.setItem('session', JSON.stringify(session));
        yield put(setSession(session));           
        yield put(setSubmitting(false));
    } catch (error) {    
        yield put(setSubmitting(false));            
        yield put(stopSubmit('LogInForm', error.response.data.error));        
    }
}

function* signUpGenerator(action) {
    try {
        yield put(setSubmitting(true));
        const session = yield call(UserProvider.signUp, action.data);        
        window.localStorage.setItem('session', JSON.stringify(session));
        yield put(setSession(session));        
        yield put(setSubmitting(false));
    } catch (error) {  
        yield put(setSubmitting(false));              
        yield put(stopSubmit('SignUpForm', error.response.data.error));
    }
}

function* getSessionGenerator(action) {
    try {
        let session = window.localStorage.getItem('session');
        session = session ? JSON.parse(session) : null;
        yield put(setSession(session));
    } catch (error) {
        console.log('Something\'s gone wrong:', error);        
    }
}

function* removeSessionGenerator(action) {
    try {
        window.localStorage.removeItem('session');        
        yield put(setSession(null)); 
        yield put(setPathname('/core-inventory')); 
    } catch (error) {
        console.log('Something\'s gone wrong:', error);        
    }
}

export function* userSaga() {
    yield takeLatest(actionTypes.LOG_IN, logInGenerator);
    yield takeLatest(actionTypes.SIGN_UP, signUpGenerator);
    yield takeLatest(actionTypes.GET_SESSION, getSessionGenerator);
    yield takeLatest(actionTypes.REMOVE_SESSION, removeSessionGenerator);
}