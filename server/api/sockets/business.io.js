import {error} from "../../utils/logging";
import * as businessService from '../../services/business.service'

export class BusinessHandler {
    constructor(socket, io) {
        this.socket = socket;
        this.io = io

        this.handler = {
            getCountries: this.getCountries,
            getBusinessProfile: this.getBusinessProfile,
            getBusinessPrice: this.getPrice,
            setBusinessPrice: this.setPrice,
            getBusinessCountry: this.getCountry,
            setBusinessCountry: this.setCountry,
        };
    }

    getCountry = (data, ackFn) => {
        businessService.getCountry(this.socket.decoded_token.sub).then(r => {
            if (r) ackFn(null, r)
            else ackFn(null, [])
        }).catch(err => {
            error(err)
            ackFn(500, null)
        })
    }
    setCountry = (data, ackFn) => {
        businessService.setCountry(data, this.socket.decoded_token.sub).then(r => {
            if (r) ackFn(null, r)
            else ackFn(null, [])
        }).catch(err => {
            error(err)
            ackFn(500, null)
        })
    }

    setPrice = (data, ackFn) => {
        businessService.setPrice(data, this.socket.decoded_token.sub).then(r => {
            if (r) ackFn(null, r)
            else ackFn(null, [])
        }).catch(err => {
            error(err)
            ackFn(500, null)
        })
    }
    getPrice = (data, ackFn) => {
        businessService.getPrice(this.socket.decoded_token.sub).then(([price, currency]) => {
            if (price) ackFn(null, {price: price, currency: currency})
            else ackFn(null, {})
        }).catch(err => {
            error(err)
            ackFn(500, null)
        })
    }

    getCountries = (data, ackFn) => {
        businessService.getCountries().then(r => {
            if (r) ackFn(null, r)
            else ackFn(null, [])
        }).catch(err => {
            error(err)
            ackFn(500, null)
        })
    }

    getBusinessProfile = (data, ackFn) => {
        businessService.getBusinessProfile(data).then(r => {
            if (r) ackFn(null, r)
            else ackFn(null, [])
        }).catch(err => {
            error(err)
            ackFn(500, null)
        })
    }

}
