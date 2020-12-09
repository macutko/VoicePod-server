import {error, log, positive_action} from "../../../utils/logging";
import * as chatService from "../../../services/chat.service";
import {getLanguageOptions, getMessages, newMessage, sendingAudioMessage} from "../../../services/message.service";

export class ChatHandler {
    constructor(socket, io) {
        this.socket = socket;
        this.io = io
        this.handler = {
            getChats: this.getChats,
            newMessage: this.newMessage,
            getMessages: this.getMessages,
            sendingAudioMessage: this.sendingAudioMessage,
            getLanguageOptions: this.getLanguageOptions
        };
    }

    getChats = (data, acknowledgeFn) => {
        positive_action('LIST OF CHATS', `${this.socket.decoded_token.sub}`)
        let response;

        chatService.getByUserId(this.socket.decoded_token.sub)
            .then(chats => {
                if (chats) {
                    response = chats

                } else {
                    console.log('nothing')
                    response = {}
                }
                acknowledgeFn(null, response)
            })
            .catch(err => {
                error(err)
                acknowledgeFn(err, null)
            });


    }

    newMessage = (data, acknowledgeFn) => {
        newMessage(data, this.socket.decoded_token.sub).then((m) => {
            //@todo : let ppl know about this!
            this.io.to(data.chatId).emit('newMessage', m)
        }).catch(e => error(e))
    }

    getMessages = (data, acknowledgeFn) => {
        getMessages(data, this.socket.decoded_token.sub).then(m => {
                if (m) {
                    acknowledgeFn(null, m)
                }
            }
        ).catch(e => error(e))
    }

    sendingAudioMessage = (data, acknowledgeFn) => {
        sendingAudioMessage(data, this.socket.decoded_token.sub).then(res => {
            log('should be emmiting newMessage')
            this.io.to(data.chatId).emit('newMessage', res)
        }).catch(e => error(e))
    }

    getLanguageOptions = (data, acknowledgeFn) => {
        getLanguageOptions(data).then(res => {
            if (res) {
                acknowledgeFn(null, res)
            } else {
                acknowledgeFn('Error', null)
            }
        }).catch(e => acknowledgeFn(e, null))
    }
}

