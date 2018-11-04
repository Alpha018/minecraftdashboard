/**
 * Created by Tomás on 03-11-2018.
 */
'use strict';

const jwt = require('jwt-simple');
const moment = require('moment');
const secretPassword = process.env.JWT_PASS || 'default';

exports.createToken = function(usuario){
    const payload = {
        _id: usuario._id,
        email: usuario.email,
        username: usuario.username,
        iat: moment().unix(),
        exp: moment().add(5,'hours').unix,
    };

    return {
        token: jwt.encode(payload, secretPassword),
        exp: moment().add(5, 'hours').toDate()
    };
};