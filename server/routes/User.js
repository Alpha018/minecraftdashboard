/**
 * Created by Tomás on 03-11-2018.
 */
'use strict';

const express = require('express');
const UserController = require('../controllers/UserController');
const mdAuth = require('../midleware/Midleware');

const api = express.Router();

api.post('/login', UserController.login);
api.get('/image/:img', UserController.getImage);
api.get('/image/thumbnail/:img', UserController.getThumbnail);
api.post('/uploadPlugin', mdAuth.ensureAuth, UserController.uploadPlugin);
api.put('/', mdAuth.ensureAuth, UserController.saveUser);
api.get('/getPlugins', mdAuth.ensureAuth, UserController.getFiles);
api.post('/changePassword', mdAuth.ensureAuth,UserController.changePassword);
api.post('/changeProfileImage', mdAuth.ensureAuth,UserController.uploadImageProfile);

module.exports = api;