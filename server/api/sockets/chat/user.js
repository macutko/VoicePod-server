import * as chatService from "../../../services/chat/index";
import {action, error, positive_action} from "../../../utils/logging";

export function getOtherPartyDetailsByChatId(data, ackFn) {
    chatService.getOtherPartyDetailsByChatId(data, this.socket.decoded_token.sub).then(res => {
        ackFn(null, res)
    }).catch(e => {
        ackFn(500, null)
        error(e)
    })
}

export function getPaidChatsByUserId(data, acknowledgeFn) {
    chatService.getPaidChatsByUserId(this.socket.decoded_token.sub)
        .then(chats => {
            if (chats) {
                acknowledgeFn(null, chats)
                positive_action('LIST OF PAID CHATS', `${chats.length}`)
            } else {
                action(`LIST OF PAID CHATS is empty`, `${chats.length}`)
                acknowledgeFn(null, {})
            }
        })
        .catch(err => {
            error(err)
            acknowledgeFn(err, null)
        });
}

export function getFreeChatsByUserId(data, acknowledgeFn) {
    chatService.getFreeChatsByUserId(this.socket.decoded_token.sub)
        .then(chats => {
            if (chats) {
                acknowledgeFn(null, chats)
                positive_action('LIST OF FREE CHATS', `${chats.length}`)
            } else {
                action(`LIST OF FREE CHATS is empty`, `${chats.length}`)
                acknowledgeFn(null, {})
            }
        })
        .catch(err => {
            error(err)
            acknowledgeFn(err, null)
        });
}
