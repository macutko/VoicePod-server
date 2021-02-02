import * as reviewService from '../../services/review.service'
import {error, positive_action} from "../../utils/logging";

export class ReviewHandler {
    constructor(socket, io) {
        this.socket = socket;
        this.io = io

        this.handler = {
            updateReviewByChatId: this.updateReviewByChatId,
            getReviewByChatId: this.getReviewByChatId,
            getReviewsOfUser: this.getReviewsOfUser,
        };
    }

    getReviewsOfUser = (data, ackFn) => {
        reviewService.getReviewsOfUser(data, this.socket.decoded_token.sub).then(r => {
            positive_action('REVIEWS OF USER: ', r.length)
            ackFn(null, r)
        }).catch(e => {
            error(e)
            ackFn(500, null)
        })
    }

    updateReviewByChatId = (data, ackFn) => {
        reviewService.updateReviewByChatId(data, this.socket.decoded_token.sub).then(r => {
            ackFn(null, r)
        }).catch(err => {
            error(err)
            ackFn(500, null)
        })
    }
    getReviewByChatId = (data, ackFn) => {
        reviewService.getReviewByChatId(data, this.socket.decoded_token.sub).then(r => {
            ackFn(null, r)
        }).catch(err => {
            error(err)
            ackFn(500, null)
        })
    }
}
