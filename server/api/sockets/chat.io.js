import {action, error, positive_action} from "../../utils/logging";
import * as chatService from "../../services/chat.service";

export class ChatHandler {
    constructor(socket, io) {
        this.socket = socket;
        this.io = io
        this.handler = {
            getChats: this.getChats,
            createChat: this.createChat
        };
    }

    getChats = (data, acknowledgeFn) => {
        chatService.getChatByUserId(this.socket.decoded_token.sub)
            .then(chats => {
                if (chats) {
                    acknowledgeFn(null, chats)
                    positive_action('LIST OF CHATS', `${this.socket.decoded_token.sub}`)
                } else {
                    action(`LIST OF CHATS is empty`, `${this.socket.decoded_token.sub}`)
                    acknowledgeFn(null, {})
                }
            })
            .catch(err => {
                error(err)
                acknowledgeFn(err, null)
            });
    }

    createChat = (data, acknowledgeFn) => {
        chatService.createChat(data).then(chat => {
            if (chat) {
                acknowledgeFn(null, chat)
            } else {
                acknowledgeFn(null, null)
            }
        }).catch(err => {
            acknowledgeFn(err, null)
        })
    }

}

