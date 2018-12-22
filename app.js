/**
 * Created by Tomás on 03-11-2018.
 */
'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const socket = require('./socketIO');

app.use(cors());

// Start socketIO
socket.startScocket(server);

app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin','*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");

    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Allow', 'GET, POST, OPTION, PUT, DELETE');

    next();
});

//middleware bodyparser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//load routes
const user_routes = require('./server/routes/User');

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));

//Base Route
app.use('/api/user', user_routes);


// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

module.exports = server;