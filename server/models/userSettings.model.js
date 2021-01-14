import {Schema, model} from 'mongoose'

const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    profile_picture: {type: String, default: null}, // TODO: this should not be stored in the DB eventually..and maybe we could put a hard limit on the lenght of the voice message
    language: {type: String, default:'en-EN'} // TODO: this is for the future once we enable multiple languages for transcript
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});

module.exports = model('UserSettings', schema);