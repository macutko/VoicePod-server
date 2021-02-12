import {Config} from "../../config";
import {Offer} from "../../models/db";

let config = new Config()


export async function setRejectOrCancelOffer(data, userId) {
    if (!data.offerId) throw 'Need offer id'

    let offer = await Offer.findById(data.offerId)
    if (!(offer.consultant.equals(userId) || offer.customer.equals(userId))) throw 'Dont have the permissions'

    const paymentIntent = await config.stripe.paymentIntents.cancel(
        offer.paymentIntentId
    );

    return Offer.findByIdAndDelete(data.offerId)
}
