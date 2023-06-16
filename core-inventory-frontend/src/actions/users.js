import { actionTypes } from '../config/actionTypes';

export const logIn = (data) => ({
    type: actionTypes.LOG_IN,
    data
});

export const logOut = {
    type: actionTypes.LOG_OUT
};

export const signUp = (data) => ({
    type: actionTypes.SIGN_UP,
    data
});

export const setSession = (session) => ({
    type: actionTypes.SET_SESSION,
    session
});

export const getSession = {
    type: actionTypes.GET_SESSION
};

export const removeSession = {
    type: actionTypes.REMOVE_SESSION
};

export const setPathname = (pathname) => ({
    type: actionTypes.SET_PATHNAME,
    pathname
});

export const setLoading = (loading) => ({
    type: actionTypes.SET_LOADING,
    loading
});

export const setSubmitting = (submitting) => ({
    type: actionTypes.SET_SUBMITTING,
    submitting
});

export const setSuccess = (success) => ({
    type: actionTypes.SET_SUCCESS,
    success
});

export const setError = (error) => ({
    type: actionTypes.SET_ERROR,
    error
});