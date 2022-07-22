const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');
const port = 5000;

const ROOT_URL = path.join(__dirname, '../index.html');
let socketToUse;

const distPath = path.join(__dirname, '../frontend/dist');
const assetsPath = path.join(__dirname, '../frontend/assets');
app.use('/frontend/dist', express.static(distPath));
app.use('/frontend/assets', express.static(assetsPath));

let connectionCallback;

const startServer = () => {
    return new Promise(resolve => {
        app.get('/', function (req, res) {
            res.sendFile(ROOT_URL);
        });
        io.on('connection', (socket) => {
            console.log('Client connected');
    
            socket.uniqueId = Math.round(Math.random() * 10000000000);
            socketToUse = socket;

            if (connectionCallback) {
                connectionCallback();
            }
    
            socket.on('disconnect', function () {
                console.log('Client disconnected');
            });
        })
        server.listen(port, function () {
            console.log(`Server established`);
            console.log(`Visit http://127.0.0.1:${port}`);

            resolve();
        });
    });
};

const emit = data => {
    if (socketToUse) {
        console.log('Emitting to client');
        socketToUse.emit('socket', data);
    } else {
        console.log('No socket exists, cant emit yet');
    }
}

const setConnetionCallback = callback => {
    connectionCallback = callback;
}

var serverFunctions = {
    startServer,
    emit,
    setConnetionCallback
};

module.exports = serverFunctions;