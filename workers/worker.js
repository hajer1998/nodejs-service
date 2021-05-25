#!/usr/bin/env node

require('dotenv').config();
const config = require('../config/config');
const queue_name = 'nodejs';
const amqp = require('amqplib/callback_api');
const io = require('../modules/socket');
const db = require('../modules/db');

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
                    userId: message.user_id,
                    postId: message.post_id,
                    ownerId: message.post_owner_id
                });

                notification.save()
                    .catch(err => {
                        console.log(err.message || "Some error occurred while creating the Notification.");
                    });
            }
            if (message.message_type === 'message') {
                db.connect();
                let Message = require ('../models/Chat');
                const chat = new Message({
                    message: message.message,
                    sender: message.sender
                });

                chat.save()
                    .catch(err => {
                        console.log(err.message || "Some error occurred while creating the Message.");
                    });
            }

            io.socket.in("user-"+message.post_owner_id).emit('message', { room: "user-"+message.post_owner_id, message: message });
        }, {
            noAck: true
        });
    });
});
