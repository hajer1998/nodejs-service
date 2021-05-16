#!/usr/bin/env node

const queue_name = 'nodejs';
var amqp = require('amqplib/callback_api');
var io = require('../modules/socket');
var config = require('../config/config');
var db = require('../modules/db');

amqp.connect(config.rabbitmq.host, function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        channel.assertQueue(queue_name, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue_name);

        channel.consume(queue_name, function(msg) {
            var message = JSON.parse(msg.content.toString());
            console.log(" [x] Received %s", message);

            if (message.message_type === 'notification') {
                db.connect();
                let Notification = require ('../models/Notification');
                const notification = new Notification({
                    userId: message.post_owner_id,
                    postId: message.post_id
                });

                notification.save()
                    .catch(err => {
                        console.log(err.message || "Some error occurred while creating the Notification.");
                    });
            }
            console.log("sending message to user: "+ message.post_owner_id);
            io.socket.in("user-"+message.post_owner_id).emit('message', { room: "user-"+message.post_owner_id, message: message });
            // io.socket.emit("user-"+message.post_owner_id, {message: message});
        }, {
            noAck: true
        });
    });
});
