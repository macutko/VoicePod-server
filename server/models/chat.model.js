import {model, Schema} from 'mongoose'

const schema = new Schema({
    userAccount: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    chatWithAccount: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    chatWithAccountUsername: {type: String, required: true},
    userAccountUsername: {type: String, required: true},
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});

module.exports = model('Chat', schema);