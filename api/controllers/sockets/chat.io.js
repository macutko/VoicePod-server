import {error, log} from "../../../utils/logging";
import * as chatService from "../../../services/chat.service";
import {getMessages, newMessage, sendingAudioMessage} from "../../../services/message.service";

export class ChatHandler {
    constructor(socket) {
        this.socket = socket;

        this.handler = {
            getChats: this.getChats,
            newMessage: this.newMessage,
            getMessages: this.getMessages,
            sendingAudioMessage: this.sendingAudioMessage
        };
    }

    getChats = (data, acknowledgeFn) => {
        log(`User ${this.socket.decoded_token.sub} wants a list of his chats`)
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
        newMessage(data, this.socket.decoded_token.sub).then((m) =>
            //@todo : let ppl know about this!
            log(m)
        ).catch(e => error(e))
    }

    getMessages = (data, acknowledgeFn) => {
        getMessages(data, this.socket.decoded_token.sub).then(m => {
                if (m) {
                    acknowledgeFn(null, m)
                }
            }
        ).catch(e => error(e))
    }

    sendingAudioMessage = (data, acknowledgeFn) =>{
        sendingAudioMessage(data,this.socket.decoded_token.sub).then(res => {
            if (res) {
                acknowledgeFn(null,res)
            }
        }).catch(e => error(e))
    }

}

