import {model, Schema} from 'mongoose'

const schema = new Schema({
    about: {type: Schema.Types.ObjectId, required: true},
    from: {type: Schema.Types.ObjectId, required: true},
    description: {type: Schema.Types.String, required: true},
    stars: {type: Schema.Types.String, required: true, enum: ['1', '2', '3', '4', '5']}
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});

module.exports = model('Review', schema);