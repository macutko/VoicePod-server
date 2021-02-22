import {model, Schema} from "mongoose";

const schema = new Schema({
    introSoundBits: {type: Schema.Types.ObjectId, ref: 'Sound', required: true, immutable: true},
    problemSoundBits: {type: Schema.Types.ObjectId, ref: 'Sound', required: true, immutable: true},
    budgetMinutes: {type: Schema.Types.Number, required: true},
    status: {type: Schema.Types.String, enum: ['pending', 'rejected', 'accepted'], default: "pending"},
    dateOfDecision: {type: Schema.Types.Date},
    createdDate: {type: Schema.Types.Date, default: Date.now},
    paymentIntentId: {type: Schema.Types.String, required: true},
    customer: {type: Schema.Types.ObjectId, ref: "User", required: true},
    consultant: {type: Schema.Types.ObjectId, ref: "User", required: true},
    price: {type: Schema.Types.Number, required: true, min: [0.1]},
    // expire_at: {type: Schema.Types.Date, default: Date.now, expires: 432000} //expires in 5 days
});

schema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret.paymentIntentId;
        delete ret._id;

    },
});

module.exports = model("Offer", schema);
