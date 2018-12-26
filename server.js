/**
 * Created by Tomás on 03-11-2018.
 */
'use strict';

require('dotenv').load();
const app = require('./app');
const log4js = require('log4js');
const logger = log4js.getLogger('Minecraft Dashboard');
const port = process.env.APP_PORT || 8000;
const mongoose = require('mongoose');

logger.level = 'debug';

logger.info('Welcome to BackEnd Minecraft Dashboard');
logger.info('Init Mongo DB connection');

mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.connect(`mongodb://${process.env.MONGO_USER}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`, {useNewUrlParser: true})
    .then(() => {
        logger.info('Connection successful');

        app.listen(port, () => {
            logger.info(`Server start in port: ${port}`);

            const User = require('./server/model/User');
            User.count({}, function (err, count) {
                if (err) {
                    logger.error(`Error when connecting to the database`);
                } else {
                    if (count === 0) {
                        const user = 'admin', password = 'password', email = 'admin@admin.cl';
                        const userSave = new User();
                        userSave.password = bcrypt.hashSync(password);
                        userSave.username = user;
                        userSave.email = email;

                        userSave.profileImg.fullImage = `${process.env.BASE_URL}/api/user/image/default.jpg`;
                        userSave.profileImg.thumbnail = `${process.env.BASE_URL}/api/user/image/thumbnail/default.jpg`;
                        userSave.profileImg.nameFileOriginal = 'default.jpg';
                        userSave.profileImg.nameFileSys = 'default.jpg';

                        userSave.save((err, user_save) => {
                            if (err) {
                                logger.error(`Error when save the first user`);
                            } else {
                                logger.info(`User: ${user} save with pass: ${password}`);
                            }
                        })
                    }
                }
            })
        })
    })
    .catch(err => {
            console.log(err);
            logger.fatal('Connection to MongoDB error')
        }
    );