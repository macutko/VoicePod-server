import 'rootpath'

import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import jwt from './api/middlewares/jwt'

import {createServer} from "http"
import {config} from './config.js'
import {authorize} from "socketio-jwt";
import {action, log} from "./utils/logging";
import {MainHandler} from "./api/controllers/sockets/main.io";
import {errorHandler} from "./api/middlewares/errorHandler";
import {ChatHandler} from "./api/controllers/sockets/chat.io";

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());

app.use(errorHandler);

// api routes
app.use('/user', require('./api/controllers/user.controller'));
app.use('/chat', require('./api/controllers/chat.controller'));

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 8080) : (config.PORT || 4000);
const server = createServer(app);
const io = require('socket.io')(server);


io.on('connection', authorize({
    secret: config.secret,
    timeout: 15000, // 15 seconds to send the authentication message
    pingInterval: 3000,
    pingTimeout: 2000,
})).on('authenticated', function (socket) {
    action('CONNECTED:', `${socket.decoded_token.sub}`)

    // Create event handlers for this socket
    let eventHandlers = {
        main: new MainHandler(socket, io),
        chat: new ChatHandler(socket, io)
    };

    // Bind events to handlers
    for (let category in eventHandlers) {
        let handler = eventHandlers[category].handler;
        for (let event in handler) {
            socket.on(event, handler[event]);
        }
    }


});
server.listen(port, () => console.log("server running on port:" + port));