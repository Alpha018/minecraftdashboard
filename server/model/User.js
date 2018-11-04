/**
 * Created by Tomás on 03-11-2018.
 */
'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    password: {
        type: String,
        required: true,
        select: false,
    },
    // Solo persona
    email: {
        type: String,
        trim: true,
        unique: true,
        validate: [function(email) {
            return /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)
        },'El email utilizado no es valido.']
    },
    //Nombre Completo
    username: {
        type: String,
        required:true,
        unique: true
    }
});

module.exports = mongoose.model('usuario', userSchema);