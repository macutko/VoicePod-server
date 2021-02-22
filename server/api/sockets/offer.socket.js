import {wrapper} from "./_wrapper";
import {
    createOffer,
    getOfferById,
    getOtherPartyDetailsByOfferId,
    getPendingOffersByUserId,
    getResolvedOffersByUserId,
    getSentOffersByUserId,
    setAcceptOffer,
    setConfirmOffer,
    setRejectOffer
} from "../../services/offer";

export class OfferHandler {
    constructor(socket, io) {
        this.socket = socket;

        this.handler = {
            createOffer: this.createOffer,
            getOfferById: this.getOfferById,
            getPendingOffersByUserId: this.getPendingOffersByUserId,
            getSentOffersByUserId: this.getSentOffersByUserId,
            getResolvedOffersByUserId: this.getResolvedOffersByUserId,
            setAcceptOffer: this.setAcceptOffer,
            setRejectOffer: this.setRejectOffer,
            setConfirmOffer: this.setConfirmOffer,
            getOtherPartyDetailsByOfferId: this.getOtherPartyDetailsByOfferId
        };
    }

    getOtherPartyDetailsByOfferId = (data, ackFn) => {
        wrapper(getOtherPartyDetailsByOfferId, data, this.socket.decoded_token.sub, ackFn)
    }
    getPendingOffersByUserId = (data, ackFn) => {
        wrapper(getPendingOffersByUserId, data, this.socket.decoded_token.sub, ackFn)
    }
    getSentOffersByUserId = (data, ackFn) => {
        wrapper(getSentOffersByUserId, data, this.socket.decoded_token.sub, ackFn)
    }
    getResolvedOffersByUserId = (data, ackFn) => {
        wrapper(getResolvedOffersByUserId, data, this.socket.decoded_token.sub, ackFn)
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
    setRejectOffer = (data, ackFn) => {
        wrapper(setRejectOffer, data, this.socket.decoded_token.sub, ackFn)
    }
    setConfirmOffer = (data, ackFn) => {
        wrapper(setConfirmOffer, data, this.socket.decoded_token.sub, ackFn)
    }
}
