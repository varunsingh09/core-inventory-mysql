import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import mainReducer from '../reducers';
import mainSaga from '../services/sagas';

const sagaMiddleware = createSagaMiddleware();

//  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__  || compose;
const composeEnhancers = compose;

export const store = createStore(mainReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));

sagaMiddleware.run(mainSaga);