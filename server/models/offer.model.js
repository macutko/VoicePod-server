import {model, Schema} from 'mongoose'

const schema = new Schema({
    // TODO: this should not be stored in the DB eventually..and maybe we could put a hard limit on the lenght of the voice message
    intro: {type: Schema.Types.String, default: null},
    introSoundBits: {type: Schema.Types.String, required: true},
    advice: {type: Schema.Types.String, default: null},
    adviceSoundBits: {type: Schema.Types.String, required: true},
    problem: {type: Schema.Types.String, default: null},
    problemSoundBits: {type: Schema.Types.String, required: true},
    outcome: {type: Schema.Types.String, default: null},
    outcomeSoundBits: {type: Schema.Types.String, required: true},
    budgetMinutes: {type: Schema.Types.Number, required: true},
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

module.exports = model('Offer', schema);