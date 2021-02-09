import * as userService from "../../../services/user/userOptions.service";
import {error} from "../../../utils/logging";

export function contactSupport  (data, ackFn)  {
    userService.contactSupport(data, this.socket.decoded_token.sub).then((r) => {
        if (r && r.accepted.length > 0) ackFn(null, true)
        else ackFn(null, false)
    }).catch((err) => {
        error(`Error in user.io ${err}`)
        ackFn(500, null)
    })
}
