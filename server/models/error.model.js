const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: { type: Schema.Types.String, required: true },
    message: { type: Schema.Types.String, required: true },
    createdDate: { type: Schema.Types.Date, default: Date.now },
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
});

module.exports = mongoose.model('error', schema);
