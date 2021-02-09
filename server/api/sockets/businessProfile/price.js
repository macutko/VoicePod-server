import * as businessService from "../../../services/businessProfile/index";
import {error} from "../../../utils/logging";

export function setPrice  (data, ackFn) {
    businessService.setPrice(data, this.socket.decoded_token.sub).then(r => {
        if (r) ackFn(null, r)
        else ackFn(null, [])
    }).catch(err => {
        error(err)
        ackFn(500, null)
    })
}

export function getPrice (data, ackFn) {
    businessService.getPrice(this.socket.decoded_token.sub).then(([price, currency]) => {
        if (price) ackFn(null, {price: price, currency: currency})
        else ackFn(null, {})
    }).catch(err => {
        error(err)
        ackFn(500, null)
    })
}
