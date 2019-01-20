/**
 * Created by Tomás on 03-11-2018.
 */
'use strict';

const jwt = require('jsonwebtoken');
const moment = require('moment');
const fs = require('fs');
const privateKEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY, 'utf8');
const publicKEY = fs.readFileSync(process.env.JWT_PUBLIC_KEY, 'utf8');

const i = 'Bird corp';
const s = 'black.xins@gmail.com';
const a = 'https://alphacode.cl';

const signOptions = {
    issuer: i,
    subject: s,
    audience: a,
    expiresIn: "5h",
    algorithm: "RS256"
};

function encode(user) {

    const payload = {
        _id: user._id,
        email: user.email,
        username: user.username
    };

    return {
        token: jwt.sign(payload, privateKEY, signOptions),
        exp: moment().add(5, 'hours').toDate()
    };
}

function verify(token) {
    return jwt.verify(token, publicKEY, signOptions);
}

module.exports = {
    encode,
    verify
};