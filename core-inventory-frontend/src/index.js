import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './config/store';
import './index.css';
import App from './App';

const mainComponent = (
    <Provider store={store}>        
        <App />        
    </Provider>
);

ReactDOM.render(mainComponent, document.getElementById('root'));