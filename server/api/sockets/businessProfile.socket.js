import {
    getBusinessCountry,
    getBusinessPrice,
    getBusinessProfile,
    getCountries,
    setBusinessCountry,
    setBusinessPrice,
} from '../../services/businessProfile';
import { wrapper } from './_wrapper';

export default class BusinessProfileHandler {
    constructor(socket, io) {
        this.socket = socket;

        this.handler = {
            getCountries: this.getCountries,
            getBusinessProfile: this.getBusinessProfile,
            getBusinessPrice: this.getPrice,
            setBusinessPrice: this.setPrice,
            getBusinessCountry: this.getCountry,
            setBusinessCountry: this.setCountry,
        };
    }

  getBusinessProfile = (data, ackFn) => {
      wrapper(getBusinessProfile, data, this.socket.decoded_token.sub, ackFn);
  };
  getPrice = (data, ackFn) => {
      wrapper(getBusinessPrice, data, this.socket.decoded_token.sub, ackFn);
  };
  setPrice = (data, ackFn) => {
      wrapper(setBusinessPrice, data, this.socket.decoded_token.sub, ackFn);
  };
  getCountries = (data, ackFn) => {
      wrapper(getCountries, data, this.socket.decoded_token.sub, ackFn);
  };
  getCountry = (data, ackFn) => {
      wrapper(getBusinessCountry, data, this.socket.decoded_token.sub, ackFn);
  };
  setCountry = (data, ackFn) => {
      wrapper(setBusinessCountry(), data, this.socket.decoded_token.sub, ackFn);
  };
}
