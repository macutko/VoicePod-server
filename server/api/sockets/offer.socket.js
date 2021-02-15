import {wrapper} from "./_wrapper";
import {
    createOffer,
    getOfferById,
    getOffersByUserId,
    setAcceptOffer,
    setConfirmOffer,
    setRejectOrCancelOffer
} from "../../services/offer";

export class OfferHandler {
    constructor(socket, io) {
        this.socket = socket;

        this.handler = {
            getOffersByUserId: this.getOffersByUserId,
            createOffer: this.createOffer,
            getOfferById: this.getOfferById,
            setAcceptOffer: this.setAcceptOffer,
            setRejectOrCancelOffer: this.setRejectOrCancelOffer,
            setConfirmOffer: this.setConfirmOffer,
        };
    }

    getOffersByUserId = (data, ackFn) => {
        wrapper(getOffersByUserId, data, this.socket.decoded_token.sub, ackFn)
    }
    createOffer = (data, ackFn) => {
        wrapper(createOffer, data, this.socket.decoded_token.sub, ackFn)
    }
    getOfferById = (data, ackFn) => {
        wrapper(getOfferById, data, this.socket.decoded_token.sub, ackFn)
    }
    setAcceptOffer = (data, ackFn) => {
        wrapper(setAcceptOffer, data, this.socket.decoded_token.sub, ackFn)
    }
    setRejectOrCancelOffer = (data, ackFn) => {
        wrapper(setRejectOrCancelOffer, data, this.socket.decoded_token.sub, ackFn)
    }
    setConfirmOffer = (data, ackFn) => {
        wrapper(setConfirmOffer, data, this.socket.decoded_token.sub, ackFn)
    }
}
