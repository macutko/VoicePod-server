import {model, Schema} from 'mongoose'

const schema = new Schema({
    chatID: {type: Schema.Types.ObjectId, ref: 'Chat', required: true},
    from: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    message: {type: String, required: true}
}, {timestamps: true});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});

module.exports = model('Message', schema);