var amqp = require('amqplib/callback_api');
var config = require('../config/config');
module.exports = {
    send_sync: (queue_name, message, callback) => {
        let result = {};
        amqp.connect(config.rabbitmq.host, function (error0, connection) {
            if (error0) {
                throw error0;
            }

            connection.createChannel(function(error, channel) {
                if (error) {
                    throw error;
                }
                channel.assertQueue('', {
                    exclusive: true,
                    autoDelete: true,
                }, function(error1, q) {
                    if (error1) {
                        throw error1;
                    }

                    let correlationId = generateUuid();

                    channel.consume(q.queue, function(msg) {
                        if (msg.properties.correlationId == correlationId) {
                            console.log(' [.] Got %s', msg.content.toString());
                            let response = msg.content.toString();
                            if (response) {
                                result = JSON.parse(response);
                            }
                            let error = null;
                            if (result.hasOwnProperty('hasError')) {
                                error = result;
                            }
                            callback(result, error);
                            setTimeout(function() {
                                connection.close();
                            }, 500);
                        }
                    }, {
                        noAck: true
                    });

                    channel.sendToQueue(queue_name, Buffer.from(JSON.stringify(message)), {
                        correlationId: correlationId,
                        replyTo: q.queue
                    });
                });
            });
        });
    }
};

function generateUuid() {
    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}
