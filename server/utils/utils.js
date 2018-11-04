/**
 * Created by Tomás on 03-11-2018.
 */
'use strict';

const jwt = require('jwt-simple');
const moment = require('moment');
const user = require('../model/User');
const secretPassword = process.env.JWT_PASS || 'default';

async function validateUser(tokenAuth) {
    let payload;

    try {
        payload = jwt.decode(tokenAuth, secretPassword);

        if (payload.sub && payload.exp <= moment().unix()) {
            return {
                status: false,
                desc: 'El token expiró'
            };
        }
    } catch (ex) {
        return {
            status: false,
            desc: 'El token no es valido'
        };
    }

    const user = await user.findOne({_id: payload._id}).exec();

    if (!user) {
        return {
            status: false,
            desc: 'El usuario no existe en el sistema'
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

module.exports = {
    validateUser,
    getFileExtension
};