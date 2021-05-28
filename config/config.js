'use strict';

module.exports = {
    db: {
        uri: process.env.MONGODB_URL,
        user: process.env.MONGODB_USER,
        pass: process.env.MONGODB_PASSWORD,
        dbName: process.env.MONGODB_AUTH_DATABASE
    },
    rabbitmq: {
        host: process.env.RABBITMQ_HOST,
        port: process.env.RABBITMQ_PORT,
        user: process.env.RABBITMQ_USER,
        password: process.env.RABBITMQ_PASSWORD
    },
    appUrl: process.env.APP_URL,
    imgUrClientId: process.env.IMGUR_CLIENT_ID
};
