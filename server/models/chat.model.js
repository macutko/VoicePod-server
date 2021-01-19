import {model, Schema} from 'mongoose'

const schema = new Schema({
    noob: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    consultant: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    offer: {type: Schema.Types.ObjectId, ref: 'Offer', required: true},
    lastMessage: {type: Schema.Types.ObjectId, ref:'Message', default: null}
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