/**
 * Created by Tomás on 03-11-2018.
 */
'use strict';

const jwt = require('jwt-simple');
const moment = require('moment');
const User = require('../model/User');
const secretPassword = process.env.JWT_PASS || 'default';

function ensureAuth(req, res, next) {
    if (!req.headers.Authorization) {
        return res.status(401).send({message: 'La peticion no tiene cabecera de autenticacion'})
    }

    const token = req.headers.Authorization.replace(/['"]+/g, '');
    let payload;

    try {
        payload = jwt.decode(token, secretPassword);

        if (payload.sub && payload.exp <= moment().unix()) {
            return res.status(401).send({
                message: 'El Token ha Expirado'
            });
        }
    } catch (ex) {
        return res.status(403).send({
            message: 'El Token no es valido'
        });
    }

    User.findOne({username: payload.username}, (err, find_user) => {
        if (err) {
            res.status(500).send({message: 'Error del servidor'});
        } else {
            if (!find_user) {
                res.status(404).send({message: 'El token de acceso no es valido.'})
            } else {
                req.usuario = payload;
                next();
            }
        }
    });

}

module.exports = {
    ensureAuth
};