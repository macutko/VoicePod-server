import {error, negative_action, positive_action} from "../../utils/logging";
import * as userService from '../../services/user.service'

export class MainHandler {
    constructor(socket, io) {
        this.socket = socket;
        this.io = io

        this.handler = {
            terminate: this.terminate,
            search: this.search,
            contactSupport: this.contactSupport
        };
    }

    contactSupport = (data, ackFn) => {
        userService.contactSupport(data, this.socket.decoded_token.sub).then((r) => {
            if (r && r.accepted.length > 0) ackFn(null, true)
            else ackFn(null, false)
        }).catch((err) => {
            error(`Error in user.io ${err}`)
            ackFn(500, null)
        })
    }

    terminate = (data) => {
        negative_action(`DISCONNECTED:`, `${this.socket.decoded_token.sub}`)
    }


    search = (data, ackFn) => {
        userService.search(data.searchQuery, this.socket.decoded_token.sub).then((r) => {
            if (r) ackFn(null, r)
            else ackFn(r, null)
            positive_action('SEARCH SUCCESS', `${r.length}`)
        }).catch((e) => {
            ackFn(e, null)
            negative_action('Error in search socket', `${e}`)
        })
    }

}

