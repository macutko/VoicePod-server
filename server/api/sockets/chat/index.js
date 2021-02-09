import {getPaidChatsByUserId, getOtherPartyDetailsByChatId, getFreeChatsByUserId} from "./user";
import {getMinutesBalance, getOfferFromChat} from "./offer";
import {closeChat, createChat, joinChat} from "./object";

export default class ChatHandler {
    constructor(socket, io) {
        this.socket = socket;
        this.io = io
        this.handler = {
            getPaidChatsByUserId: getPaidChatsByUserId.bind(this),
            getFreeChatsByUserId: getFreeChatsByUserId.bind(this),
            getMinutesBalance: getMinutesBalance.bind(this),
            getOtherPartyDetailsByChatId: getOtherPartyDetailsByChatId.bind(this),
            joinChat: joinChat.bind(this),
            closeChat: closeChat.bind(this),
            createChat: createChat.bind(this),
            getOfferFromChat: getOfferFromChat.bind(this),
        };
    }
}
