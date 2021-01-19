import {model, Schema} from 'mongoose'

const schema = new Schema({
    // TODO: this should not be stored in the DB eventually..and maybe we could put a hard limit on the lenght of the voice message
    chatId: {type: Schema.Types.ObjectId, ref: 'Chat', required: true, immutable: true},
    from: {type: Schema.Types.ObjectId, ref: 'User', required: true, immutable: true},
    transcript: {type: String},
    soundBits: {type: String, required: true},
    read: {type: Schema.Types.Boolean, default: false},
    duration: {type: Schema.Types.Number, required: true}
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