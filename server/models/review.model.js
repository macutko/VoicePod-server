import {model, Schema, Types} from 'mongoose'


const schema = new Schema({
    title: {type: Schema.Types.String, required: true},
    chatId: {type: Schema.Types.ObjectId, ref: 'Chat', required: true},
    from: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    about: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    review: {type: Schema.Types.String, required: true},
    stars: {type: Schema.Types.Number, required: true, enum: [1, 2, 3, 4, 5]},
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;

        //this can break stuff but at the time of writing i didnt need it to do more
        if (Types.ObjectId.isValid(ret.about)) delete ret.about
        if (Types.ObjectId.isValid(ret.from)) delete ret.from
        if (ret.from == null) delete ret.from
        if (ret.about == null) delete ret.about

        delete ret.chatId;
        delete ret.hash;
    }
});

module.exports = model('Review', schema);