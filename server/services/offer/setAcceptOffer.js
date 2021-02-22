import { Chat, Offer } from '../../models/db';
import { Config } from '../../config';

let config = new Config();
export async function setAcceptOffer(data, userId) {
    // for the consultant to accept the offer
    if (!data.offerId) throw 'Need offer id';

    let offer = await Offer.findById(data.offerId);
    if (!offer) throw 'No such offer - broken reloading of the client on delete?';
    if (!offer.consultant.equals(userId)) throw 'Not allowed';

    const paymentIntent = await config.stripe.paymentIntents.retrieve(
        offer.paymentIntentId
    );

    offer.status = 'accepted';

    if (paymentIntent.status === 'requires_capture') {
    // If 3D has passed, just capture the payments

        const capture = await config.stripe.paymentIntents.capture(
            offer.paymentIntentId
        );

        if (capture.status === 'succeeded') {
            // if the payments was capture, delete the offer and create a chat
            let newChat = new Chat({
                customer: offer.customer,
                consultant: offer.consultant,
                type: 'paid',
                status: 'paid',
                paymentIntentId: offer.paymentIntentId,
                introSoundBits: offer.introSoundBits,
                problemSoundBits: offer.problemSoundBits,
                budgetMinutes: offer.budgetMinutes,
                price: offer.price,
            });
            await newChat.save();
            return Offer.findByIdAndDelete(data.offerId);
        }

    //    if the offer wasn't captured or needs 3D just save the offer as accepted and move on
    }
    return offer.save();
}
