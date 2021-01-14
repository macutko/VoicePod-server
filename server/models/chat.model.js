import {model, Schema} from 'mongoose'

const schema = new Schema({
    users: [{type: Schema.Types.ObjectId, ref: 'User', required: true}]
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