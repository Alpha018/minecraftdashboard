/**
 * Created by Tomás on 03-11-2018.
 */
'use strict';

const jwt = require('../services/jwt');
const moment = require('moment');
const User = require('../model/User');

function ensureAuth(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send({message: 'La peticion no tiene cabecera de autenticacion'})
    }

    const token = req.headers.authorization.replace(/['"]+/g, '');
    let payload;

    try {
        payload = jwt.verify(token);

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

    User.findOne({_id: payload._id}, (err, find_user) => {
        if (err) {
            res.status(500).send({message: 'Error del servidor'});
        } else {
            if (!find_user) {
                res.status(404).send({message: 'El token de acceso no es valido.'})
            } else {
                req.user = payload.payload;
                next();
            }
        }
    });

}

module.exports = {
    ensureAuth
};