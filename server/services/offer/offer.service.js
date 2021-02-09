import {Config} from "../../config";
import {Chat, Offer, User} from "../../models/db";

let config = new Config()

/**
 * Get all the offers associated with a user
 * @param userId
 *
 */
export async function getOffersByUserId(userId) {
    return new Promise((resolve, reject) =>
        Offer.find().or([{'customer': userId}, {'consultant': userId}])
            .limit(20).populate({
            path: 'customer',
            select: "username firstName lastName profilePicture pictureType",
            match: {_id: {$ne: userId}}
        }).populate({
            path: 'consultant',
            select: "username firstName lastName profilePicture pictureType",
            match: {_id: {$ne: userId}}
        }).exec(function (err, offer) {
            try {
                if (err) reject(err)
                let data = [];
                for (const o of offer) {
                    // if requesting user is the consultant, the customer object will not be empty
                    if (o.customer) {
                        data.push({id: o.id, isCustomer: false, user: o.customer})
                    } else {
                        data.push({id: o.id, isCustomer: true, user: o.consultant})
                    }
                }
                resolve(data)
            } catch (e) {
                reject(e)
            }

        }))
}

/**
 * get a specific offer by its ID
 * @param data
 * @param userId
 * @returns {Promise<Query<Document | null, Document>>}
 */
export async function getOfferById(data, userId) {
    return Offer.findById(data.offerId).or([{'customer': userId}, {'consultant': userId}]).select({
        introSoundBits: 1,
        problemSoundBits: 1,
        budgetMinutes: 1,
        accepted: 1,
        dateOfDecision: 1,
        createdDate: 1,
        price: 1
    })
}

/**
 * Crete a new offer and lock the payment
 * @param data
 * @param userId
 * @returns {Promise<{clientSecret: string}|boolean>}
 */
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
    if (!offer) throw 'No such offer - broken reloading of the client on delete?'
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
