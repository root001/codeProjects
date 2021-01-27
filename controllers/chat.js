const chatServer = require('http').createServer(express);
const client = require("socket.io")(chatServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT"],
        credentials: true
    }
});

const Chat = require('../models/chatModel');

//connect to socket.io
const chatBot = client.on('connection', function(socket) {

    //create function to send status
    sendStatus = function(s) {
        socket.emit('status', s);
    }

    //select top 100 chats
    Chat.find.limit(100).sort({ _id: 1 }).toArray(function(err, res) {
        if (err) {
            throw err;
        }
        //Emit the messages
        socket.emit('output', res);
    });

    //Handle input events
    socket.on('input', function(data) {
        let name = data.name;
        let message = data.message;

        if (name == '' || message == '') {
            //send error status
            senndStatus('Please enter a message');
        } else {
            Chat.insertOne({ name: name, message: message }, function() {
                client.emit('output', [data]);
                //send status object
                sendStatus({
                    message: 'Message sent',
                    clear: true
                });
            });
        }
    });

});
chatServer.listen(4000);