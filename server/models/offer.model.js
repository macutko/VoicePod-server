import { model, Schema } from "mongoose";

const schema = new Schema({
  // TODO: this should not be stored in the DB eventually..and maybe we could put a hard limit on the lenght of the voice message
  introSoundBits: { type: Schema.Types.String, required: true },
  problemSoundBits: { type: Schema.Types.String, required: true },
  budgetMinutes: { type: Schema.Types.Number, required: true },
  accepted: { type: Schema.Types.Boolean, default: false },
  dateOfDecision: { type: Schema.Types.Date },
  createdDate: { type: Schema.Types.Date, default: Date.now },
  paymentIntentId: { type: Schema.Types.String, required: true },
  customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
  consultant: { type: Schema.Types.ObjectId, ref: "User", required: true },
  price: { type: Schema.Types.Number, required: true, min: [0.1] }, // TODO: change this to per hour everywhere!!!
  // expire_at: {type: Schema.Types.Date, default: Date.now, expires: 432000} //expires in 5 days
});

schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.hash;
    delete ret.paymentIntentId;
  },
});

module.exports = model("Offer", schema);
