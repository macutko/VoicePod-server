import {model, Schema} from 'mongoose'

const schema = new Schema({
    noob: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    expert: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    accepted: {type: Schema.Types.Boolean, default: false},
    dateOfDecision: {type: Schema.Types.Date},
    createdDate: {type: Date, default: Date.now},
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