import {createMessage, getMessages} from "./object";

export default class MessageHandler {
    constructor(socket, io) {
        this.socket = socket;
        this.io = io
        this.handler = {
            createMessage: createMessage.bind(this),
            getMessages: getMessages.bind(this),
        };
    }
}
