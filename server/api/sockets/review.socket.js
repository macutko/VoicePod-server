import {wrapper} from "./_wrapper";
import {getReviewByChatId, getReviewsOfUser, updateReviewByChatId} from "../../services/review";

export default class ReviewHandler {
    constructor(socket, io) {
        this.socket = socket;

        this.handler = {
            updateReviewByChatId: this.updateReviewByChatId,
            getReviewByChatId: this.getReviewByChatId,
            getReviewsOfUser: this.getReviewsOfUser,
        };
    }

    updateReviewByChatId = (data, ackFn) => {
        wrapper(updateReviewByChatId, data, this.socket.decoded_token.sub, ackFn)
    }
    getReviewByChatId = (data, ackFn) => {
        wrapper(getReviewByChatId, data, this.socket.decoded_token.sub, ackFn)
    }
    getReviewsOfUser = (data, ackFn) => {
        wrapper(getReviewsOfUser, data, this.socket.decoded_token.sub, ackFn)
    }
}
