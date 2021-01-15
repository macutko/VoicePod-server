import {model, Schema} from 'mongoose'

const schema = new Schema({
    chatID: {type: Schema.Types.ObjectId, ref: 'Chat', required: true, immutable: true},
    from: {type: Schema.Types.ObjectId, ref: 'User', required: true, immutable: true},
    message: {type: String, required: true},
    soundBits: {type: String} // TODO: this should not be stored in the DB eventually..and maybe we could put a hard limit on the lenght of the voice message
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