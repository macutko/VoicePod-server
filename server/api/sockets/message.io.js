import * as messageService from "../../services/message.service";
import {error} from "../../utils/logging";

export class MessageHandler {
    constructor(socket, io) {
        this.socket = socket;
        this.io = io
        this.handler = {
            newMessage: this.newMessage,
            getMessages: this.getMessages,
        };
    }

    newMessage = (data, ackFn) => {
        messageService.newMessage(data, this.socket.decoded_token.sub).then(([success, message]) => {
            if (success) {
                ackFn(null, message)
                this.io.to(data.chatId).emit('newMessage', {chatId: data.chatId, message: message})
            } else {
                ackFn(null, 'Not enough minutes')
            }
        }).catch(e => error(e))
    }

    getMessages = (data, acknowledgeFn) => {
        messageService.getMessages(data, this.socket.decoded_token.sub).then(m => {
                if (m) {
                    acknowledgeFn(null, m)
                }
            }
        ).catch(e => error(e))
    }


}