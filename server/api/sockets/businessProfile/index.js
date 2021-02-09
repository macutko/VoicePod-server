import {getPrice, setPrice} from "./price";

import {getCountries, getCountry, setCountry} from "./country";
import {getBusinessProfile} from "./object";


export default class BusinessProfileHandler {
    constructor(socket, io) {
        this.socket = socket;
        this.io = io

        this.handler = {
            getCountries: getCountries.bind(this),
            getBusinessProfile: getBusinessProfile.bind(this),
            getBusinessPrice: getPrice.bind(this),
            setBusinessPrice: setPrice.bind(this),
            getBusinessCountry: getCountry.bind(this),
            setBusinessCountry: setCountry.bind(this),
        };
    }
}
