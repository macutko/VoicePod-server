import { positiveAction } from '../../utils/logging';
import {
    createFreeChat,
    getFreeChatsByUserId,
    getMinutesBalance,
    getOfferFromChat,
    getOtherPartyDetailsByChatId,
    getPaidChatsByUserId,
    setCloseChat,
} from '../../services/chat';
import { wrapper } from './_wrapper';

export default class ChatHandler {
    constructor(socket, io) {
        this.socket = socket;

        this.handler = {
            getPaidChatsByUserId: this.getPaidChatsByUserId,
            getFreeChatsByUserId: this.getFreeChatsByUserId,
            getMinutesBalance: this.getMinutesBalance,
            getOtherPartyDetailsByChatId: this.getOtherPartyDetailsByChatId,
            socketJoinChat: this.socketJoinChat,
            setCloseChat: this.setCloseChat,
            createChat: this.createFreeChat,
            getOfferFromChat: this.getOfferFromChat,
        };
    }

  getPaidChatsByUserId = (data, ackFn) => {
      wrapper(getPaidChatsByUserId, data, this.socket.decoded_token.sub, ackFn);
  };
  getFreeChatsByUserId = (data, ackFn) => {
      wrapper(getFreeChatsByUserId, data, this.socket.decoded_token.sub, ackFn);
  };
  getOtherPartyDetailsByChatId = (data, ackFn) => {
      wrapper(
          getOtherPartyDetailsByChatId,
          data,
          this.socket.decoded_token.sub,
          ackFn
      );
  };
  getMinutesBalance = (data, ackFn) => {
      wrapper(getMinutesBalance, data, this.socket.decoded_token.sub, ackFn);
  };
  setCloseChat = (data, ackFn) => {
      wrapper(setCloseChat, data, this.socket.decoded_token.sub, ackFn);
  };
  createFreeChat = (data, ackFn) => {
      wrapper(createFreeChat, data, this.socket.decoded_token.sub, ackFn);
  };
  getOfferFromChat = (data, ackFn) => {
      wrapper(getOfferFromChat, data, this.socket.decoded_token.sub, ackFn);
  };
  socketJoinChat = (data, ackFn) => {
      if (data.chatId) {
          this.socket.join(data.chatId);
          positiveAction('JOINED CHAT!', `${data.chatId}`);
          ackFn(null, true);
      } else {
          ackFn(null, 'Need a chatId');
      }
  };
}
