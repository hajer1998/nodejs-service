var amqp = require('amqplib');
var config = require('../config/config');
//il permet de créer un correlation_id
function generateUuid() {
    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}

const connect = (url) => {
    return new Promise((resolve, reject) => {
        amqp.connect(url)
            .then(conn => resolve(conn))
            .catch(err => reject(err))
    })
}

const createChannel = conn => {
    return new Promise((resolve, reject) => {
        conn.createChannel()
            .then(channel => resolve(channel))
            .catch(err => reject(err))
    })
}

const channelAssertQueue = (channel) => {
    return new Promise((resolve, reject) => {
        channel.assertQueue('', {
            exclusive: true,
            autoDelete: true,
        })
            .then(asserted => resolve(asserted))
            .catch(err => reject(err))
    })
}

const sendToQueue = (channel, queueName, assertedQueue, message) => {
    return new Promise((resolve, reject) => {
        let correlationId = generateUuid();

        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
            correlationId: correlationId,
            replyTo: assertedQueue
        })
            .then(resolve(correlationId))
            .catch(err => reject(err))
    })
}

const consumeQueue = (channel, assertedQueue) => {
    return new Promise(resolve => {
        channel.consume(assertedQueue, (msg) => {
            resolve(msg)
        })
    })
}

const receiveResponse = (correlationId, response) => {
    var result, error;
    console.log(correlationId);
    if (response.properties.correlationId == correlationId) {
        console.log(' [.] Got %s', response.content.toString());
        response = response.content.toString();
        if (response) {
            result = JSON.parse(response);
        }
        if (result && result.hasOwnProperty('hasError')) {
            error = result;
        }

        return {result, error}
    }
}

const closeConnection = (connection) => {
    setTimeout(function() {
        connection.close();
    }, 500);
}

module.exports = {
    send_sync: async (queueName, message) => {
        var conn = await connect(config.rabbitmq.host)
        var channel = await createChannel(conn)
        var assertedQueue = await channelAssertQueue(channel, queueName)
        let correlationId = await sendToQueue(channel, queueName, assertedQueue.queue, message)
        let response = await consumeQueue(channel, assertedQueue.queue, correlationId)
        await closeConnection(conn)

        return receiveResponse(correlationId, response)
    }
}