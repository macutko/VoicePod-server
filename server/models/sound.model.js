import {model, Schema} from 'mongoose'


const schema = new Schema({
    soundBits: {type: Schema.Types.String, required: true},
    allowedUsers: [{type: Schema.Types.ObjectId, ref: 'User', required: true}],
    durationInSeconds: {type: Schema.Types.Number, required: true}
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

module.exports = model('Sound', schema);
