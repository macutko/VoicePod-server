import {Chat, Offer} from "../../models/db";
import {Config} from "../../config";

let config = new Config()
export async function setConfirmOffer(data, userId) {
    //TODO: recreate this into a webhook and put it onto a dev SERVER
    //for the customer to confirm his payment method

    if (!data.offerId) throw 'Need offer id'

    let offer = await Offer.findById(data.offerId)

    if (offer.customer.equals(userId)) throw 'Not allowed'

    const paymentIntent = await config.stripe.paymentIntents.retrieve(
        offer.paymentIntentId
    );

    if (paymentIntent.status === 'requires_capture' && offer.accepted) {
        // if the offer was accepted and need a capture, do a capture
        const paymentIntent = await config.stripe.paymentIntents.capture(
            offer.paymentIntentId
        );

        if (paymentIntent.status === "succeeded") {
            //if the payments was captured, delete the offer and create a chat
            let newChat = new Chat({
                customer: offer.customer,
                consultant: offer.consultant,
                type: 'paid',
                status: 'paid',
                paymentIntentId: offer.paymentIntentId,
                introSoundBits: offer.introSoundBits,
                problemSoundBits: offer.problemSoundBits,
                budgetMinutes: offer.budgetMinutes

            })
            await newChat.save()
            return Offer.findByIdAndDelete(data.offerId);
        }

    } else {

        //    if the capture wasnt succesful do a 3D
        return {clientSecret: paymentIntent.client_secret}

    }

}
