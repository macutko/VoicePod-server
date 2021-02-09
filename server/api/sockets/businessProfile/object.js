import * as businessService from "../../../services/businessProfile/index";
import {error} from "../../../utils/logging";

export function getBusinessProfile (data, ackFn) {
    businessService.getBusinessProfile(data).then(r => {
        if (r) ackFn(null, r)
        else ackFn(null, [])
    }).catch(err => {
        error(err)
        ackFn(500, null)
    })
}
