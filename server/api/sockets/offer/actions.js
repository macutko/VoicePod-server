import * as offerService from "../../../services/offer/offer.service";
import {error} from "../../../utils/logging";

export function confirmOffer(data, ackFn) {
    offerService.confirmOffer(data, this.socket.decoded_token.sub).then(r => {
        if (r) ackFn(null, r)
        else ackFn(null, [])
    }).catch(err => {
        error(err)
        ackFn(500, null)
    })
}


export function rejectOrCancelOffer(data, ackFn) {
    offerService.rejectOrCancelOffer(data, this.socket.decoded_token.sub).then(r => {
        if (r) ackFn(null, r)
        else ackFn(null, [])
    }).catch(err => {
        error(err)
        ackFn(500, null)
    })
}

export function acceptOffer(data, ackFn) {
    offerService.acceptOffer(data, this.socket.decoded_token.sub).then(r => {
        if (r) ackFn(null, r)
        else ackFn(null, [])
    }).catch(err => {
        error(err)
        ackFn(500, null)
    })
}
