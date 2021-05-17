'use strict';

module.exports = {
    db: {
        uri: process.env.MONGODB_URL || 'mongodb://11.5.0.4:27017/test',
        user: "root",
        pass: "root",
        dbName: "admin"
    },
    rabbitmq: {
        host: 'amqp://172.18.0.1',
        port: 5672,
        user: 'guest',
        password: 'guest'
    }
};
