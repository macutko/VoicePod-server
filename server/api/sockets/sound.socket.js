import { wrapper } from './_wrapper';
import { getSoundById } from '../../services/sound';

export default class SoundHandler {
    constructor(socket, io) {
        this.socket = socket;

        this.handler = {
            getSoundById: this.getSoundById,
        };
    }

  getSoundById = (data, ackFn) => {
      wrapper(getSoundById, data, this.socket.decoded_token.sub, ackFn);
  };
}
