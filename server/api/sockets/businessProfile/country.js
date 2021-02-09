import * as businessService from "../../../services/businessProfile/index";
import {error} from "../../../utils/logging";

export function getCountries (data, ackFn) {
    businessService.getCountries().then(r => {
        if (r) ackFn(null, r)
        else ackFn(null, [])
    }).catch(err => {
        error(err)
        ackFn(500, null)
    })
}


export function getCountry  (data, ackFn) {
    businessService.getCountry(this.socket.decoded_token.sub).then(r => {
        if (r) ackFn(null, r)
        else ackFn(null, [])
    }).catch(err => {
        error(err)
        ackFn(500, null)
    })
}
export function  setCountry  (data, ackFn) {
    businessService.setCountry(data, this.socket.decoded_token.sub).then(r => {
        if (r) ackFn(null, r)
        else ackFn(null, [])
    }).catch(err => {
        error(err)
        ackFn(500, null)
    })
}


