import * as chatService from "../../../services/chat/index";
import {error} from "../../../utils/logging";

export function getOfferFromChat (data, ackFn)  {
    chatService.getOfferFromChat(data, this.socket.decoded_token.sub).then(res => {
        ackFn(null, res)
    }).catch(e => {
        ackFn(500, null)
        error(e)
    })
}

export function getMinutesBalance  (data, ackFn)  {
    chatService.getMinutesBalance(data, this.socket.decoded_token.sub).then(minutes => {
        if (minutes) {
            ackFn(null, minutes)
        } else {
            ackFn(null, {})
        }
    }).catch(e => {
        ackFn(500, null)
        error(e)
    })
}
