/**
 * Created by Tomás on 03-11-2018.
 */
'use strict';

const jwt = require('jwt-simple');
const moment = require('moment');
const User = require('../model/User');
const secretPassword = process.env.JWT_PASS || 'default';

async function validateUser(tokenAuth) {
    let payload;

    try {
        payload = jwt.decode(tokenAuth, secretPassword);

        if (payload.sub && payload.exp <= moment().unix()) {
            return {
                status: false,
                desc: 'Token expired'
            };
        }
    } catch (ex) {
        return {
            status: false,
            desc: 'Invalid Token'
        };
    }

    const user = await User.findOne({_id: payload._id}).exec();

    if (!user) {
        return {
            status: false,
            desc: 'User not exist'
        };
    } else {
        return {
            status: true,
            desc: '',
            user: user
        };
    }
}

function getFileExtension(filename) {
    const ext = /^.+\.([^.]+)$/.exec(filename);
    return ext == null ? '' : ext[1];
}

function removeExtension(filename) {
    return filename.split('.').slice(0, -1).join('.');
}

module.exports = {
    validateUser,
    getFileExtension,
    removeExtension
};