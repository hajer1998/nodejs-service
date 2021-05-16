const mongoose = require('mongoose');
const config = require('../config/config');

function connect(){
    mongoose.connection
        .on('error', console.log)
        .on('disconnected', connect);
    return mongoose.connect(config.db.uri, {
        keepAlive: 1,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        user: config.db.user,
        pass: config.db.pass,
        authSource: config.db.dbName
    });
}

module.exports = {
    connect: () => connect()
}
