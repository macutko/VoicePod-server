import { model, Schema } from 'mongoose';

const schema = new Schema({
    username: {
        type: Schema.Types.String,
        unique: true,
        required: true,
        lowercase: true,
    },
    stripeCustomerId: { type: Schema.Types.String, unique: true, required: true },
    hash: { type: Schema.Types.String, required: true },
    firstName: { type: Schema.Types.String, required: true },
    lastName: { type: Schema.Types.String, required: true },
    createdDate: { type: Schema.Types.Date, default: Date.now },
    email: { type: Schema.Types.String, required: true },
    confirmedEmail: { type: Schema.Types.Boolean, default: false },
    profilePicture: { type: Schema.Types.String, default: null },
    pictureType: { type: Schema.Types.String, enum: ['jpg', 'png', 'jpeg'] },
    description: { type: Schema.Types.String, default: 'Add a BIO of yourself' },
    searchTags: [{ type: Schema.Types.String }],
    businessProfile: {
        type: Schema.Types.ObjectId,
        ref: 'BusinessProfile',
        default: null,
    }, // for detail access on business account of user (i.e. is it done with stirpe)
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) {
        delete ret._id;
        delete ret.hash;
        delete ret.confirmedEmail;
        delete ret.createdDate;
        delete ret.id;
        delete ret.businessProfile;
        delete ret.stripeCustomerId;
    },
});

module.exports = model('User', schema);
