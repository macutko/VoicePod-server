import {action, error, positive_action} from "../../utils/logging";
import * as chatService from "../../services/chat.service";

export class ChatHandler {
    constructor(socket, io) {
        this.socket = socket;
        this.io = io
        this.handler = {
            getChats: this.getChats,
            offerProposition: this.offerProposition,
            getOffer: this.getOffer,
            acceptOffer: this.acceptOffer,
            rejectOffer: this.rejectOffer,
            getMinutesBalance: this.getMinutesBalance,
            joinChat: this.joinChat,
            closeChat: this.closeChat
        };
    }

    closeChat = (data,ackFn) =>{
        chatService.closeChat(data, this.socket.decoded_token.sub).then(res => {
            if (res) {
                ackFn(null, res)
            } else {
                ackFn(null, {})
            }
        }).catch(e => {
            ackFn(500, null)
            error(e)
        })
    }

    joinChat = (data, ackFn) => {
        if (data.chatId) {
            this.socket.join(data.chatId)

            positive_action('JOINED CHAT!', `${data.chatId}`)
            ackFn(null, true)
        } else {
            ackFn(null, 'Need a chatId')
        }
    }
    getMinutesBalance = (data, ackFn) => {
        chatService.getMinutesBalance(data, this.socket.decoded_token.sub).then(minutes => {
            if (minutes) {
                ackFn(null, minutes)
            } else {
                ackFn(null, {})
            }
        }).catch(e => {
            ackFn(500, null)
            error(e)
        })
    }

    acceptOffer = (data, ackFn) => {
        chatService.decisionOfferById(data, this.socket.decoded_token.sub, true).then(offer => {
            if (offer) {
                ackFn(null, offer)
            } else {
                ackFn(null, {})
            }
        }).catch(e => {
            ackFn(500, null)
            error(e)
        })
    }

    rejectOffer = (data, ackFn) => {
        chatService.decisionOfferById(data, this.socket.decoded_token.sub, false).then(offer => {
            console.log(offer)
            if (offer) {
                ackFn(null, offer)
            } else {
                ackFn(null, {})
            }
        }).catch(e => {
            ackFn(500, null)
            error(e)
        })
    }

    getOffer = (data, ackFn) => {
        chatService.getOfferById(data, this.socket.decoded_token.sub).then(offer => {
            if (offer) {
                ackFn(null, offer)
            } else {
                ackFn(null, {})
            }
        }).catch(e => {
            ackFn(500, null)
            error(e)
        })
    }

    getChats = (data, acknowledgeFn) => {
        chatService.getChatByUserId(this.socket.decoded_token.sub)
            .then(chats => {
                if (chats) {
                    acknowledgeFn(null, chats)
                    positive_action('LIST OF CHATS', `${chats.length}`)
                } else {
                    action(`LIST OF CHATS is empty`, `${chats.length}`)
                    acknowledgeFn(null, {})
                }
            })
            .catch(err => {
                error(err)
                acknowledgeFn(err, null)
            });
    }

    offerProposition = (data, ackFn) => {
        chatService.offerProposition(data, this.socket.decoded_token.sub).then(r => {
            if (r) {
                ackFn(null, r)
            } else {
                ackFn(500, null)
            }
        }).catch(err => {
            ackFn(500, null)
        })
    }

}

