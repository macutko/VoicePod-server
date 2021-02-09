import {search} from "./search";
import {contactSupport} from "./contactSupport";
import {addPaymentMethod, checkDefaultPaymentMethod, getPaymentMethod, setDefaultPaymentMethod} from "./payment";

export default class UserOptionsHandler {
    constructor(socket, io) {
        this.socket = socket;
        this.io = io

        this.handler = {
            search: search.bind(this),
            contactSupport: contactSupport.bind(this),
            addPaymentMethod: addPaymentMethod.bind(this),
            getPaymentMethod: getPaymentMethod.bind(this),
            setDefaultPaymentMethod: setDefaultPaymentMethod.bind(this),
            checkDefaultPaymentMethod: checkDefaultPaymentMethod.bind(this),
        };
    }
}
