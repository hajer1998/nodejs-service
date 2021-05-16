const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
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
    })
};

server.listen(8080);
