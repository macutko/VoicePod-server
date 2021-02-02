import {model, Schema} from 'mongoose'
import {stripeCountryCodes} from "../utils/stripeCountryCode";

let codes = [];
stripeCountryCodes.map((object, key) => {
    codes.push(object.code)
})

const schema = new Schema({
    createdDate: {type: Schema.Types.Date, default: Date.now},
    stripeId: {type: Schema.Types.String, required: true},
    chargesEnabled: {type: Schema.Types.Boolean, default: false},
    country: {type: Schema.Types.String, default: 'SK', enum: codes},
    price: {type: Schema.Types.Number, default: 0.5, min: [0.1]}, // TODO: change this to per hour everywhere!!!
    currency: {type: Schema.Types.String, default: 'eur'},
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.createdDate;
        delete ret.id;
        delete ret.stripeId;
        delete ret.chargesEnabled;
    }
});

module.exports = model('BusinessProfile', schema);