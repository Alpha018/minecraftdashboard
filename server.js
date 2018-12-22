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
        })
    })
    .catch(err => {
            console.log(err);
            logger.fatal('Connection to MongoDB error')
        }
    );