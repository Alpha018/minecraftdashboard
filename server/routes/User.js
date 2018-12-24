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
api.put('/', mdAuth.ensureAuth, UserController.saveUser);
api.post('/changePassword', mdAuth.ensureAuth, UserController.changePassword);
api.post('/changeProfileImage', mdAuth.ensureAuth, UserController.uploadImageProfile);
api.post('/uploadplugins', mdAuth.ensureAuth, UserController.uploadPlugins);
api.get('/getPlugins', mdAuth.ensureAuth, UserController.getFiles);
api.post('/changestatusplugin', mdAuth.ensureAuth, UserController.changeStatusPlugin);

module.exports = api;