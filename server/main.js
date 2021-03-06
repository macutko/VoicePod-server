import 'rootpath';

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from './api/middlewares/jwt';

import { createServer } from 'http';

import { authorize } from 'socketio-jwt';
import { action } from './utils/logging';
import { errorHandler } from './api/middlewares/errorHandler';

import { Config } from './config';

import ChatHandler from './api/sockets/chat.socket';
import UserOptionsHandler from './api/sockets/user.socket';
import MessageHandler from './api/sockets/message.socket';
import { OfferHandler } from './api/sockets/offer.socket';
import ReviewHandler from './api/sockets/review.socket';
import BusinessProfileHandler from './api/sockets/businessProfile.socket';
import SoundHandler from './api/sockets/sound.socket';

let conf = new Config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());

app.use(errorHandler);

// api routes
app.use('/user', require('./api/controllers/user.controller'));

// start server

const server = createServer(app);
const io = require('socket.io')(server);

io.on(
    'connection',
    authorize({
        secret: conf.secret,
        timeout: 15000, // 15 seconds to send the authentication message
        pingInterval: 3000,
        pingTimeout: 2000,
    })
).on('authenticated', function(socket) {
    action('CONNECTED:', `${socket.decoded_token.sub}`);

    // Create event handlers for this socket
    let eventHandlers = {
        main: new UserOptionsHandler(socket, io),
        chat: new ChatHandler(socket, io),
        message: new MessageHandler(socket, io),
        business: new BusinessProfileHandler(socket, io),
        offer: new OfferHandler(socket, io),
        review: new ReviewHandler(socket, io),
        sound: new SoundHandler(socket, io),
    };

    // Bind events to handlers
    for (let category in eventHandlers) {
        let handler = eventHandlers[category].handler;
        for (let event in handler) {
            socket.on(event, handler[event]);
        }
    }
});
server.listen(conf.PORT, () =>
    console.log('server running on port:' + conf.PORT)
);
