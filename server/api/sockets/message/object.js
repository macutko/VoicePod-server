import * as messageService from "../../../services/message/message.service";
import {error} from "../../../utils/logging";

export function createMessage(data, ackFn) {
    messageService.createMessage(data, this.socket.decoded_token.sub).then(([success, message]) => {
        if (success) {
            ackFn(null, message)
            this.io.to(data.chatId).emit('newMessage', {chatId: data.chatId, message: message})
        } else {
            ackFn(null, 'Not enough minutes')
        }
    }).catch(e => {
        ackFn(500, null)
        error(e)
    })
}

export function getMessages(data, acknowledgeFn) {
    messageService.getMessages(data, this.socket.decoded_token.sub).then(m => {
            if (m) {
                acknowledgeFn(null, m)
            }
        }
    ).catch(e => error(e))
}

