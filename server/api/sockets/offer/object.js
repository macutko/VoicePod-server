import * as offerService from "../../../services/offer/offer.service";
import {error} from "../../../utils/logging";

export function getOfferById (data, ackFn) {
    offerService.getOfferById(data, this.socket.decoded_token.sub).then(r => {
        if (r) ackFn(null, r)
        else ackFn(null, [])
    }).catch(err => {
        error(err)
        ackFn(500, null)
    })
}


export function getOffersByUserId(data, ackFn) {
    offerService.getOffersByUserId(this.socket.decoded_token.sub).then(r => {
        if (r) ackFn(null, r)
        else ackFn(null, [])
    }).catch(err => {
        error(err)
        ackFn(500, null)
    })
}

export function createOffer (data, ackFn) {
    offerService.createOffer(data, this.socket.decoded_token.sub).then(r => {
        if (r) ackFn(null, r)
        else ackFn(null, [])
    }).catch(err => {
        error(err)
        ackFn(500, null)
    })
}
