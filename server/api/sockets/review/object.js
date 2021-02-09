import * as reviewService from "../../../services/review/review.service";
import {error, positive_action} from "../../../utils/logging";

export function getReviewsOfUser(data, ackFn) {
    reviewService.getReviewsOfUser(data, this.socket.decoded_token.sub).then(r => {
        positive_action('REVIEWS OF USER: ', r.length)
        ackFn(null, r)
    }).catch(e => {
        error(e)
        ackFn(500, null)
    })
}

export function updateReviewByChatId(data, ackFn) {
    reviewService.updateReviewByChatId(data, this.socket.decoded_token.sub).then(r => {
        ackFn(null, r)
    }).catch(err => {
        error(err)
        ackFn(500, null)
    })
}

export function getReviewByChatId(data, ackFn) {
    reviewService.getReviewByChatId(data, this.socket.decoded_token.sub).then(r => {
        ackFn(null, r)
    }).catch(err => {
        error(err)
        ackFn(500, null)
    })
}
