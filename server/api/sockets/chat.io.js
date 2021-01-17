import {action, error, positive_action} from "../../utils/logging";
import * as chatService from "../../services/chat.service";

export class ChatHandler {
    constructor(socket, io) {
        this.socket = socket;
        this.io = io
        this.handler = {
            getChats: this.getChats,
            offerProposition: this.offerProposition
        };
    }

    getChats = (data, acknowledgeFn) => {
        chatService.getChatByUserId(this.socket.decoded_token.sub)
            .then(chats => {
                if (chats) {
                    acknowledgeFn(null, chats)
                    positive_action('LIST OF CHATS', `${chats.length}`)
                } else {
                    action(`LIST OF CHATS is empty`, `${chats.length}`)
                    acknowledgeFn(null, {})
                }
            })
            .catch(err => {
                error(err)
                acknowledgeFn(err, null)
            });
    }

    offerProposition = (data, ackFn) => {
        chatService.offerProposition(data, this.socket.decoded_token.sub).then(r => {
            if (r) {
                ackFn(null, r)
            } else {
                ackFn(500, null)
            }
        }).catch(err => {
            ackFn(500, null)
        })
    }

}

