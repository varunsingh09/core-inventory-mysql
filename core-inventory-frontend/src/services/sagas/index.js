import { all } from 'redux-saga/effects';
import { userSaga } from './userSaga';
import { categorySaga } from './categorySaga';
import { itemSaga } from './itemSaga';

export default function* mainSaga() {
    yield all([
        userSaga(),
        categorySaga(),
        itemSaga()
    ]);
}