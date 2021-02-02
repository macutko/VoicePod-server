import {error, negative_action, positive_action} from "../../utils/logging";
import * as userService from '../../services/userOptions.service'

export class UserOptionsHandler {
    constructor(socket, io) {
        this.socket = socket;
        this.io = io

        this.handler = {
            search: this.search,
            contactSupport: this.contactSupport,
            addPaymentMethod: this.addPaymentMethod,
            getPaymentMethod: this.getPaymentMethod,
            setDefaultPaymentMethod: this.setDefaultPaymentMethod,
            checkDefaultPaymentMethod: this.checkDefaultPaymentMethod,
        };
    }

    checkDefaultPaymentMethod = (data, ackFn) => {
        userService.checkDefaultPaymentMethod(this.socket.decoded_token.sub).then(r => {
            if (r) ackFn(null, r)
        }).catch(err => {
            error(err)
            ackFn(500, null)
        })
    }

    setDefaultPaymentMethod = (data, ackFn) => {
        userService.setDefaultPaymentMethod(data, this.socket.decoded_token.sub).then(r => {
            if (r) ackFn(null, r)
            else ackFn(null, {})
        }).catch(err => {
            error(err)
            ackFn(500, null)
        })
    }

    getPaymentMethod = (data, ackFn) => {
        userService.getDefaultPaymentMethod(data, this.socket.decoded_token.sub).then(r => {
            if (r) ackFn(null, r)
            else ackFn(null, {})
        }).catch(err => {
            error(err)
            ackFn(500, null)
        })
    }


    addPaymentMethod = (data, ackFn) => {
        userService.addPaymentMethod(data, this.socket.decoded_token.sub).then(r => {
            if (r) ackFn(null, r)
            else ackFn(null, {})
        }).catch(err => {
            error(err)
            ackFn(500, null)
        })
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

