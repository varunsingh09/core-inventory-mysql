const express = require('express');
const cors = require('cors');
const { appConfig } = require('./config');
const api = require('./routes/api');

const app = express();

//  Settings
app.set('port', appConfig.port);

//  Last element of whiteList is the front-end development origin.
const whiteList = [
    'https://coreinventory.netlify.app',
    'http://coreinventory.netlify.app',
    'http://localhost:3000'
];
app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
        if (whiteList.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//  Routes
app.get('/', (req, res) => res.send('Welcome to Core Inventory API'));
app.use('/api', api);

module.exports = app;