const config = require('../config/config')
const db = require('../modules/db');
const app = require('express')();
const server = require('http').Server(app);


const io = require('socket.io')(server, {
    cors: {
        origin: config.appUrl, // accept only connections coming from APP_URL
    }
});
module.exports = {

    socket : any = io.on('connection', (socket) => { // hedha yaml listen al function lkol k tconnecty 3 socket naffedh hedhoukom lkol
        console.log('User Socket Connected');
//ko wahda 3ibara ala event maa listener
        socket.on('subscribe', function(room) {
            console.log('joining room', room);
            socket.join(room);
        });
//ko wahda 3ibara ala event maa listener
        socket.on('unsubscribe', function(room) {
            console.log('leaving room', room);
            socket.leave(room);
        });
//ko wahda 3ibara ala event maa listener
        socket.on("disconnect", () => console.log(`${socket.id} User disconnected.`));

        socket.on('chat_message', (data) => { // listen on a specific message event
            console.log('Message received: ', data);
            data = JSON.parse(data);
            db.connect();
            let chatMessage = require('../models/ChatMessage');
            const chat_Message = new chatMessage({
                sender_id: data.sender_id,
                receiver_id: data.receiver_id,
                message: data.message
            });
            chat_Message.save()
                .catch(err => {
                    console.log(err.data || "Some error occurred while saving messages.");
                });
            // socket.in: send message event to a specific channel
            // socket.emit nhotou fiha data eli nhebou nb3thouha
            socket.in("user-"+data.receiver_id).emit('chat_message', { room: "user-"+data.receiver_id, message: data.message, sender_id: data.sender_id });
        });
    })


};

server.listen(8080);
