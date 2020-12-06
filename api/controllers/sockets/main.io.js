import {log} from "../../../utils/logging";

export class MainHandler {
    constructor(socket) {
        this.socket = socket;

        this.handler = {
            terminate: this.terminate,
            joinRoom: this.joinRoom,
        };
    }

    terminate = (data) => {
        log(`User ${this.socket.decoded_token.sub} has terminated his connection.`)
    }
    joinRoom = (data) => {
        log(`User ${this.socket.decoded_token.sub} joined the room ${data.roomName}`)
        this.socket.join(data.roomName)
    }

}

