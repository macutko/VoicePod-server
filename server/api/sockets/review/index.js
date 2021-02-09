import {getReviewByChatId, getReviewsOfUser, updateReviewByChatId} from "./object";

export default class ReviewHandler {
    constructor(socket, io) {
        this.socket = socket;
        this.io = io

        this.handler = {
            updateReviewByChatId: updateReviewByChatId.bind(this),
            getReviewByChatId: getReviewByChatId.bind(this),
            getReviewsOfUser: getReviewsOfUser.bind(this),
        };
    }
}
