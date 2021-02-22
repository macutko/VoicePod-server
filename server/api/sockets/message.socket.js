import {
    createMessage,
    getMessages,
    sendNewMessageAndCreateChat,
} from '../../services/message';
import { wrapper } from './_wrapper';

export default class MessageHandler {
    constructor(socket, io) {
        this.socket = socket;
        this.io = io;

        this.handler = {
            createMessage: this.createMessage,
            getMessages: this.getMessages,
            sendNewMessageAndCreateChat: this.sendNewMessageAndCreateChat,
        };
    }

  createMessage = (data, ackFn) => {
      wrapper(createMessage, data, this.socket.decoded_token.sub, ackFn);
  };
  getMessages = (data, ackFn) => {
      wrapper(getMessages, data, this.socket.decoded_token.sub, ackFn);
  };
  sendNewMessageAndCreateChat = (data, ackFn) => {
      wrapper(
          sendNewMessageAndCreateChat,
          data,
          this.socket.decoded_token.sub,
          ackFn
      );
  };
}
