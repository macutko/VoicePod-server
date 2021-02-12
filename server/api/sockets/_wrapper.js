import {error} from "../../utils/logging";

export function wrapper(service, data, userId, ackFn) {
    return service(data, userId).then(r => {
        if (r) ackFn(null, r)
        else ackFn(null, {})
    }).catch(err => {
        error(err)
        ackFn(500, null)
    })
}
