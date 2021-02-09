import * as userService from "../../../services/user/userOptions.service";
import {negative_action, positive_action} from "../../../utils/logging";

export function search(data, ackFn) {
    userService.search(data.searchQuery, this.socket.decoded_token.sub).then((r) => {
        if (r) ackFn(null, r)
        else ackFn(r, null)
        positive_action('SEARCH SUCCESS', `${r.length}`)
    }).catch((e) => {
        ackFn(e, null)
        negative_action('Error in search socket', `${e}`)
    })
}
