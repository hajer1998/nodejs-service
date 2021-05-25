const config = require('../config/config')
const app = require('express')();
const server = require('http').Server(app);


const io = require('socket.io')(server, {
    cors: {
        origin: config.appUrl,
    }
});
module.exports = {

    socket : any = io.on('connection', (socket) => {
        console.log('User Socket Connected');

        socket.on('subscribe', function(room) {
            console.log('joining room', room);
            socket.join(room);
        });

        socket.on('unsubscribe', function(room) {
            console.log('leaving room', room);
            socket.leave(room);
        });

        socket.on("disconnect", () => console.log(`${socket.id} User disconnected.`));

        socket.on("chat message", function(msg) {
            console.log("message: "  +  msg);
            //broadcast message to everyone in port:5000 except yourself.
            socket.broadcast.emit("received", { message: msg  });

            //save chat to the database
            connect.then(db  =>  {
                console.log("connected correctly to the server");
//We are creating a new document and saving it into the Chat collection in the database.
                let  chatMessage  =  new Chat({ message: msg, sender: "Anonymous"});
                chatMessage.save();
            });
        });
    })

};

server.listen(8080);
