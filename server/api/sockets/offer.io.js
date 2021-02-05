import {error} from "../../utils/logging";
import * as offerService from '../../services/offer.service'

export class OfferHandler {
    constructor(socket, io) {
        this.socket = socket;
        this.io = io

        this.handler = {
            getOffersByUserId: this.getOffersByUserId,
            createOffer: this.createOffer,
            getOfferById: this.getOfferById,
            acceptOffer: this.acceptOffer,
            rejectOrCancelOffer: this.rejectOrCancelOffer,
            confirmOffer: this.confirmOffer
        };
    }

    confirmOffer = (data, ackFn) => {
        offerService.confirmOffer(data, this.socket.decoded_token.sub).then(r => {
            if (r) ackFn(null, r)
            else ackFn(null, [])
        }).catch(err => {
            error(err)
            ackFn(500, null)
        })
    }


    rejectOrCancelOffer = (data, ackFn) => {
        offerService.rejectOrCancelOffer(data, this.socket.decoded_token.sub).then(r => {
            if (r) ackFn(null, r)
            else ackFn(null, [])
        }).catch(err => {
            error(err)
            ackFn(500, null)
        })
    }

    acceptOffer = (data, ackFn) => {
        offerService.acceptOffer(data, this.socket.decoded_token.sub).then(r => {
            if (r) ackFn(null, r)
            else ackFn(null, [])
        }).catch(err => {
            error(err)
            ackFn(500, null)
        })
    }

    getOfferById = (data, ackFn) => {
        offerService.getOfferById(data, this.socket.decoded_token.sub).then(r => {
            if (r) ackFn(null, r)
            else ackFn(null, [])
        }).catch(err => {
            error(err)
            ackFn(500, null)
        })
    }


    getOffersByUserId = (data, ackFn) => {
        offerService.getOffersByUserId(this.socket.decoded_token.sub).then(r => {
            if (r) ackFn(null, r)
            else ackFn(null, [])
        }).catch(err => {
            error(err)
            ackFn(500, null)
        })
    }

    createOffer = (data, ackFn) => {
        offerService.createOffer(data, this.socket.decoded_token.sub).then(r => {
            if (r) ackFn(null, r)
            else ackFn(null, [])
        }).catch(err => {
            error(err)
            ackFn(500, null)
        })
    }

}

