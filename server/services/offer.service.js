import {Config} from "../config";
import {Chat, Offer, User} from "../models/db";

let config = new Config()

export async function getOffers(userId) {
    //TODO: return just ID's and make into a stream instead of long strings
    return Offer.find().or([{'customer': userId}, {'consultant': userId}])
        .populate({
            path: 'customer',
            select: "username firstName lastName profilePicture pictureType",
            match: {_id: {$ne: userId}}
        }).populate({
            path: 'consultant',
            select: "username firstName lastName profilePicture pictureType",
            match: {_id: {$ne: userId}}
        }).limit(20);
}

export async function getOfferById(data, userID) {
    return Offer.findById(data.offerId)
}

export async function createOffer(data, userId) {
    if (!data.username) throw 'Need a consultant username'
    if (!data.intro || !data.problem || !data.budget) throw 'No voice clip or budget'
    if (data.budget <= 0) throw  'invalid budget'

    if (!userId) throw 'SECURITY ISSUE!'
    let customer = await User.findById(userId)
    if (!customer) throw 'No such account!'

    let consultant = await User.findOne({username: data.username}).populate({path: "businessProfile"})
    if (!consultant) throw 'no such account!'


    let stripe_customer = await config.stripe.customers.retrieve(
        customer.stripeCustomerId,
    );

    //THIS means that there is a need to get default payment method
    if (!stripe_customer.invoice_settings.default_payment_method) return false

    let paymentIntent = await config.stripe.paymentIntents.create({
        amount: consultant.businessProfile.price * data.budget * 100,
        customer: customer.stripeCustomerId,
        currency: 'eur',
        payment_method: stripe_customer.invoice_settings.default_payment_method,
        capture_method: 'manual',
    });

    if (!paymentIntent.id) throw 'Error in transaction!'

    console.log(data.budget)
    let newOffer = new Offer({
        introSoundBits: data.intro,
        problemSoundBits: data.problem,
        budgetMinutes: data.budget,
        paymentIntentId: paymentIntent.id,
        customer: customer.id,
        consultant: consultant.id,
        price: consultant.businessProfile.price
    })

    await newOffer.save()

    return {clientSecret: paymentIntent.client_secret}
}

export async function rejectOrCancelOffer(data, userId) {
    if (!data.offerId) throw 'Need offer id'

    let offer = await Offer.findById(data.offerId)
    console.log(offer.consultant === userId)
    console.log(offer.customer === userId)
    console.log(userId)
    console.log(offer.customer)
    console.log(offer.consultant)
    if (!(offer.consultant.equals(userId) || offer.customer.equals(userId))) throw 'Dont have the permissions'

    const paymentIntent = await config.stripe.paymentIntents.cancel(
        offer.paymentIntentId
    );

    return Offer.findByIdAndDelete(data.offerId)
}

export async function acceptOffer(data, userId) {
    //for the consultant to accept the offer
    if (!data.offerId) throw 'Need offer id'

    let offer = await Offer.findById(data.offerId)

    if (!(offer.consultant.equals(userId))) throw 'Not allowed'

    const paymentIntent = await config.stripe.paymentIntents.retrieve(
        offer.paymentIntentId
    );

    offer.accepted = true

    if (paymentIntent.status === 'requires_capture') {
        // If 3D has passed, just capture the payments

        const capture = await config.stripe.paymentIntents.capture(
            offer.paymentIntentId
        );

        if (capture.status === "succeeded") {
            //if the payments was capture, delete the offer and create a chat
            let newChat = new Chat({
                customer: offer.customer,
                consultant: offer.consultant,
                type: 'paid',
                status: 'paid',
                paymentIntentId: offer.paymentIntentId,
                introSoundBits: offer.introSoundBits,
                problemSoundBits: offer.problemSoundBits,
                budgetMinutes: offer.budgetMinutes,
                price: offer.price
            })
            await newChat.save()
            return Offer.findByIdAndDelete(data.offerId);
        }

        //    if the offer wasn't captured or needs 3D just save the offer as accepted and move on
    }
    return offer.save()
}

export async function confirmOffer(data, userId) {
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