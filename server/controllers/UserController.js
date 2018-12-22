/**
 * Created by Tomás on 03-11-2018.
 */
'use strict';

const bcrypt = require('bcrypt-nodejs');
const User = require('../model/User');
const jwt = require('../services/jwt');
const utils = require('../utils/utils');
const formidable = require('formidable');
const fs = require('fs');
const log4js = require('log4js');
const logger = log4js.getLogger('Minecraft Dashboard');

const IMAGE_DIRECTORY = __dirname + "../../../img";
const mime = require('mime-types');
const imageThumbnail = require('image-thumbnail');

function login(req, res) {
    const params = req.body;

    const emailUser = params.emailUser;
    const password = params.password;

    User.findOne({
        $and: [
            {$or: [{username: emailUser}, {email: emailUser}]}
        ]
    }).select('+password').exec(function (err, user_find) {
        if (err) {
            res.status(500).send({
                desc: 'Error en el servidor',
                err: err.message
            })
        } else {
            if (!user_find) {
                res.status(404).send({
                    desc: 'Usuario no encontrado'
                })
            } else {
                const check = bcrypt.compareSync(password, user_find.password);
                if (check) {
                    if (params.gettoken) {

                        user_find["password"] = null;
                        const tok = jwt.createToken(user_find);

                        res.status(200).send({
                            token: tok.token,
                            exp: tok.exp
                        });

                    } else {

                        user_find["password"] = null;
                        res.status(200).send(user_find);

                    }
                } else {
                    res.status(400).send({message: 'La contraseña es incorrecta'});
                }
            }
        }
    })
}

function saveUser(req, res) {
    const params = req.body;

    const email = params.email;
    const username = params.username;
    const password = params.password;

    const userSave = new User();
    userSave.password = bcrypt.hashSync(password);
    userSave.username = username;
    userSave.email = email;

    userSave.save((err, user_saved) => {
        if (err) {
            res.status(500).send({
                desc: 'Error en el servidor',
                err: err.message
            })
        } else {
            res.status(200).send(user_saved);
        }
    })
}

function changePassword(req, res) {
    const body = req.body;

    User.findOne({_id: body._id}).select('+password').exec(function (err, user_finded) {
        const check = bcrypt.compareSync(body.old, user_finded.password);
        if (check) {
            user_finded.password = bcrypt.hashSync(body.new);
            user_finded.save((err, user_saved) => {
                if (err) {
                    res.status(500).send({
                        desc: 'Error en el servidor',
                        err: err.message
                    })
                } else {
                    res.status(200).send(user_saved);
                }
            })
        } else {
            res.status(403).send({
                desc: 'Contraseña incorrecta'
            })
        }
    })
}

function getFiles(req, res) {
    const archivos = [];

    fs.readdirSync(process.env.DIRECTORY_PLUGINS).forEach(file => {
        if (getFileExtension(file) === 'JAR' || getFileExtension(file) === 'jar') {
            archivos.push(file);
        }
    });

    res.status(200).send({
        plugins: archivos
    });
}

function uploadImageProfile(req, res) {
    const form = new formidable.IncomingForm();
    form.uploadDir = IMAGE_DIRECTORY;
    form.keepExtensions = true;

    form.on('file', function (field, file) {

    });

    form.on('error', function (err) {
        res.status(500).send({
            desc: 'Error al subir el archivo'
        });
        logger.error("An error has occured with form upload");
        req.resume();
    });

    form.on('aborted', function (err) {
        res.status(500).send({
            desc: 'Usuario abortó la petición',
            error: err.message
        });
        logger.error("user aborted upload");
    });

    form.parse(req, function (err, fields, files) {
        if (!err) {
            if (utils.getFileExtension(files.file.name) !== 'png' &&
                utils.getFileExtension(files.file.name) !== 'PNG' &&
                utils.getFileExtension(files.file.name) !== 'jpg' &&
                utils.getFileExtension(files.file.name) !== 'JPG') {

                try {
                    fs.unlinkSync(files.file.path);
                } catch (err) {
                    logger.info('File don\'t exist');
                }

                res.status(500).send({
                    desc: 'Archivo con formato Invalido'
                });

            } else {
                const user = req.user;

                User.findOne({_id: user._id}, async (err, user_find) => {
                    if (err) {
                        res.status(500).send({
                            desc: 'Error en el servidor',
                            error: e.message
                        });

                        try {
                            fs.unlinkSync(files.file.path);
                        } catch (err) {
                            logger.info('File don\'t exist');
                        }

                    } else {
                        if (!user_find) {
                            res.status(404).send({
                                desc: 'Usuario no encontrado',
                                error: err.message
                            });

                            try {
                                fs.unlinkSync(files.file.path);
                            } catch (err) {
                                logger.info('File don\'t exist');
                            }

                        } else {

                            try {
                                fs.unlinkSync(`${IMAGE_DIRECTORY}/${user_find.profileImg.nameFileSys}`);
                            } catch (err) {
                                logger.info('File don\'t exist');
                            }

                            const nombre = 'upload' + files.file.path.split('upload')[1];
                            user_find.profileImg.fullImage = `${process.env.BASE_URL}/api/user/image/${nombre}`;
                            user_find.profileImg.thumbnail = `${process.env.BASE_URL}/api/user/image/thumbnail/${nombre}`;
                            user_find.profileImg.nameFileOriginal = files.file.name;
                            user_find.profileImg.nameFileSys = nombre;

                            user_find.save((err, user_saved) => {
                                if (err) {
                                    res.status(500).send({
                                        desc: 'Error en el servidor',
                                        error: err.message
                                    });
                                } else {
                                    res.status(200).send(user_saved);
                                }
                            });
                        }
                    }
                })
            }
        }
    });
}

function uploadPlugin(req, res) {
    const form = new formidable.IncomingForm();
    form.uploadDir = process.env.DIRECTORY_PLUGINS;
    form.keepExtensions = true;

    form.on('file', function (field, file) {
        //rename the incoming file to the file's name
        fs.rename(file.path, form.uploadDir + "/" + file.name, function (err) {
            if (err) {
                res.status(500).send({
                    desc: 'Error en el servidor',
                    err: err
                })
            }
        });
    });

    form.on('error', function (err) {
        res.status(500).send({
            desc: 'Ocurrió un error en la subida del archivo'
        });
        logger.fatal('Error al intentar subir un plugin');
        req.resume();
    });

    form.on('aborted', function (err) {
        res.status(500).send({
            desc: 'Subida de plugin cancelado por el usuario'
        });
        logger.error('Subida de plugin cancelado por el usuario');
    });

    form.parse(req, function (err, fields, files) {
        if (!err) {
            const name = 'upload' + files.file.path.split('upload')[1];
            if (utils.getFileExtension(files.file.name) !== 'jar' && utils.getFileExtension(files.file.name) !== 'JAR') {
                try {
                    fs.unlinkSync(files.file.path);
                } catch (err) {
                    logger.error('Archivo no existe');
                }
                res.status(500).send({desc: 'Archivo con formato Invalido'});
            } else {
                res.status(200).send({
                    desc: 'Archivo guardado'
                })
            }
        }
    });
}

function getImage(req, res) {
    const fileName = req.params.img;

    if (fileName) {
        try {
            const img = fs.readFileSync(IMAGE_DIRECTORY + `/${fileName}`);
            res.writeHead(200, {'Content-Type': mime.lookup(img)});
            res.end(img, 'binary');
        } catch (e) {
            const img = fs.readFileSync(IMAGE_DIRECTORY + '/default.jpg');
            res.writeHead(200, {'Content-Type': mime.lookup(img)});
            res.end(img, 'binary');
        }
    } else {
        res.status(500).send({
            desc: 'Error en el nombre del archivo'
        })
    }
}

async function getThumbnail(req, res) {
    const fileName = req.params.img;

    if (fileName) {
        try {
            const img = fs.readFileSync(IMAGE_DIRECTORY + `/${fileName}`);
            const thumbnail = await imageThumbnail(IMAGE_DIRECTORY + `/${fileName}`);
            res.writeHead(200, {'Content-Type': mime.lookup(img)});
            res.end(thumbnail, 'binary');
        } catch (e) {
            const img = fs.readFileSync(IMAGE_DIRECTORY + '/default.jpg');
            const thumbnail = await imageThumbnail(IMAGE_DIRECTORY + '/default.jpg');
            res.writeHead(200, {'Content-Type': mime.lookup(img)});
            res.end(thumbnail, 'binary');
        }
    } else {
        res.status(500).send({
            desc: 'Error en el nombre del archivo'
        })
    }
}

module.exports = {
    login,
    saveUser,
    changePassword,
    getFiles,
    uploadPlugin,
    uploadImageProfile,
    getImage,
    getThumbnail
};