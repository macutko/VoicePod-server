import * as userService from "../../../services/user/userOptions.service";
import {error} from "../../../utils/logging";

export function checkDefaultPaymentMethod(data, ackFn) {
    userService.checkDefaultPaymentMethod(this.socket.decoded_token.sub).then(r => {
        if (r) ackFn(null, r)
    }).catch(err => {
        error(err)
        ackFn(500, null)
    })
}

export function setDefaultPaymentMethod(data, ackFn) {
    userService.setDefaultPaymentMethod(data, this.socket.decoded_token.sub).then(r => {
        if (r) ackFn(null, r)
        else ackFn(null, {})
    }).catch(err => {
        error(err)
        ackFn(500, null)
    })
}

export function getPaymentMethod(data, ackFn) {
    userService.getDefaultPaymentMethod(data, this.socket.decoded_token.sub).then(r => {
        if (r) ackFn(null, r)
        else ackFn(null, {})
    }).catch(err => {
        error(err)
        ackFn(500, null)
    })
}


export function addPaymentMethod(data, ackFn) {
    userService.addPaymentMethod(data, this.socket.decoded_token.sub).then(r => {
        if (r) ackFn(null, r)
        else ackFn(null, {})
    }).catch(err => {
        error(err)
        ackFn(500, null)
    })
}
