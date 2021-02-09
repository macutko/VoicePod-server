import {createOffer, getOfferById, getOffersByUserId} from "./object";
import {acceptOffer, confirmOffer, rejectOrCancelOffer} from "./actions";

export class OfferHandler {
    constructor(socket, io) {
        this.socket = socket;
        this.io = io

        this.handler = {
            getOffersByUserId: getOffersByUserId.bind(this),
            createOffer: createOffer.bind(this),
            getOfferById: getOfferById.bind(this),
            acceptOffer: acceptOffer.bind(this),
            rejectOrCancelOffer: rejectOrCancelOffer.bind(this),
            confirmOffer: confirmOffer.bind(this),
        };
    }
}
