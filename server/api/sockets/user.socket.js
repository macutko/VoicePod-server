import {wrapper} from "./_wrapper";
import {
    contactSupport,
    getCheckDefaultPaymentMethod,
    getDefaultPaymentMethod,
    searchUser,
    setAddPaymentMethod,
    setDefaultPaymentMethod
} from "../../services/user";

export default class UserOptionsHandler {
    constructor(socket, io) {
        this.socket = socket;

        this.handler = {
            searchUser: this.searchUser,
            contactSupport: this.contactSupport,
            setAddPaymentMethod: this.setAddPaymentMethod,
            getDefaultPaymentMethod: this.getDefaultPaymentMethod,
            setDefaultPaymentMethod: this.setDefaultPaymentMethod,
            getCheckDefaultPaymentMethod: this.getCheckDefaultPaymentMethod,
        };
    }

    getCheckDefaultPaymentMethod = (data, ackFn) => {
        wrapper(getCheckDefaultPaymentMethod, data, this.socket.decoded_token.sub, ackFn)
    }
    setDefaultPaymentMethod = (data, ackFn) => {
        wrapper(setDefaultPaymentMethod, data, this.socket.decoded_token.sub, ackFn)
    }
    getDefaultPaymentMethod = (data, ackFn) => {
        wrapper(getDefaultPaymentMethod, data, this.socket.decoded_token.sub, ackFn)
    }
    setAddPaymentMethod = (data, ackFn) => {
        wrapper(setAddPaymentMethod, data, this.socket.decoded_token.sub, ackFn)
    }
    contactSupport = (data, ackFn) => {
        wrapper(contactSupport, data, this.socket.decoded_token.sub, ackFn)
    }
    searchUser = (data, ackFn) => {
        wrapper(searchUser, data, this.socket.decoded_token.sub, ackFn)
    }
}
