import {negative_action, positive_action} from "../../utils/logging";

export class MainHandler {
    constructor(socket, io) {
        this.socket = socket;
        this.io = io

        this.handler = {
            terminate: this.terminate,
            joinChats: this.joinChats,
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

}

