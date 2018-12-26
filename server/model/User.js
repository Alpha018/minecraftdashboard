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

    email: {
        type: String,
        trim: true,
        unique: true,
        validate: [function(email) {
            return /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)
        },'email is not valid']
    },

    username: {
        type: String,
        required:true,
        unique: true
    },

    profileImg: {
        fullImage: {
            type: String
        },
        thumbnail: {
            type: String
        },
        nameFileOriginal: {
            type: String
        },
        nameFileSys: {
            type: String
        }
    }

});

module.exports = mongoose.model('usuario', userSchema);