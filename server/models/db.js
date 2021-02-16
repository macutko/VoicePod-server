import {Config} from "../config";
import mongoose from 'mongoose'

const connectionOptions = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
};

let conf = new Config()

mongoose.connect(conf.connectionString, connectionOptions);
mongoose.Promise = global.Promise;

module.exports = {
    User: require('./user.model'),
    Error: require('./error.model'),
    Chat: require('./chat.model'),
    Message: require('./message.model'),
    Review: require('./review.model'),
    Offer: require('./offer.model'),
    Sound: require('./sound.model'),
    BusinessProfile: require('./businessProfile.model'),
};
