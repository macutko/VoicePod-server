import {negative_action, positive_action} from "../../utils/logging";
import * as userService from '../../services/user.service'

export class MainHandler {
    constructor(socket, io) {
        this.socket = socket;
        this.io = io

        this.handler = {
            terminate: this.terminate,
            joinChats: this.joinChats,
            search: this.search,
        };
    }

    terminate = (data) => {
        negative_action(`DISCONNECTED:`, `${this.socket.decoded_token.sub}`)
    }
    joinChats = (data, ackFn) => {
        for (const item of data) {
            this.socket.join(item.chatId)
        }
        positive_action('JOINED CHATS!', `${this.socket.decoded_token.sub}`)
        ackFn(null, `Should be joined to all chats ${data}`)

    }

    search = (data, ackFn) => {
        userService.search(data.searchQuery).then((r) => {
            if (r) ackFn(null, r)
            else ackFn(r, null)
            positive_action('SEARCH SUCCESS', `${r.length}`)
        }).catch((e) => {
            ackFn(e, null)
            negative_action('Error in search socket', `${e}`)
        })
    }

}

