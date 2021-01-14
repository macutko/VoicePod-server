import * as messageService from "../../services/message.service";
import {error, log} from "../../utils/logging";

export class MessageHandler {
    constructor(socket, io) {
        this.socket = socket;
        this.io = io
        this.handler = {
            newMessage: this.newMessage,
            getMessages: this.getMessages
            // getLanguageOptions: this.getLanguageOptions
        };
    }

    newMessage = (data, acknowledgeFn) => {
        messageService.newMessage(data, this.socket.decoded_token.sub).then((m) => {
            this.io.to(data.chatId).emit('newMessage', m)
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

    // getLanguageOptions = (data, acknowledgeFn) => {
    //     messageService.getLanguageOptions(data).then(res => {
    //         if (res) {
    //             acknowledgeFn(null, res)
    //         } else {
    //             acknowledgeFn('Error', null)
    //         }
    //     }).catch(e => acknowledgeFn(e, null))
    // }
}