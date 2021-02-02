import {model, Schema} from 'mongoose'

const schema = new Schema({
    customer: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    consultant: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    type: {type: Schema.Types.String, enum: ['free', 'paid'], default: "free"},
    status: {type: Schema.Types.String, enum: ['open', 'paid', 'closed'], default: "open"},
    lastMessage: {type: Schema.Types.ObjectId, ref: 'Message', default: null},
    paymentIntentId: {type: Schema.Types.String,},
    introSoundBits: {type: Schema.Types.String},
    problemSoundBits: {type: Schema.Types.String},
    budgetMinutes: {type: Schema.Types.Number},
    price: {type: Schema.Types.Number, default: 0.5, min: [0.1]}, // TODO: change this to per hour everywhere!!!
    usedMinutes: {type: Schema.Types.Number, default: 0},
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.paymentIntentId;
    }
});

module.exports = model('Chat', schema);