import * as chatService from "../../../services/chat/index";
import {error, positive_action} from "../../../utils/logging";

export function createChat(data, ackFn) {
    chatService.createFreeChat(data, this.socket.decoded_token.sub).then(res => {
        ackFn(null, res)
    }).catch(e => {
        ackFn(500, null)
        error(e)
    })
}

export function closeChat(data, ackFn) {
    chatService.closeChat(data, this.socket.decoded_token.sub).then(res => {
        if (res) {
            ackFn(null, res)
        } else {
            ackFn(null, {})
        }
    }).catch(e => {
        ackFn(500, null)
        error(e)
    })
}

export function joinChat(data, ackFn) {
    if (data.chatId) {
        this.socket.join(data.chatId)
        positive_action('JOINED CHAT!', `${data.chatId}`)
        ackFn(null, true)
    } else {
        ackFn(null, 'Need a chatId')
    }
}
