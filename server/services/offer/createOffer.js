import { Config } from '../../config';
import { Offer, User } from '../../models/db';
import { createSound } from '../sound/_create_util';
import { error } from '../../utils/logging';

let config = new Config();

/**
 * Crete a new offer and lock the payment
 * @param data
 * @param userId
 * @returns {Promise<{}>}
 */
export async function createOffer(data, userId) {
    // TODO: return offer if there is one as such

    if (!data.username) throw 'Need a consultant username';
    if (!data.intro || !data.problem || !data.budget)
        throw 'No voice clip or budget';
    if (data.budget <= 0) throw 'invalid budget';

    if (!userId) throw 'SECURITY ISSUE!';
    let customer = await User.findById(userId);
    if (!customer) throw 'No such account!';

    let consultant = await User.findOne({ username: data.username }).populate({
        path: 'businessProfile',
    });
    if (!consultant) throw 'no such account!';

    let stripeCustomer = await config.stripe.customers.retrieve(
        customer.stripeCustomerId
    );

    // THIS means that there is a need to get default payment method
    if (!stripeCustomer.invoice_settings.default_payment_method) return false;

    let paymentIntent = await config.stripe.paymentIntents.create({
        amount: consultant.businessProfile.price * data.budget * 100,
        customer: customer.stripeCustomerId,
        currency: 'eur',
        // eslint-disable-next-line camelcase
        payment_method: stripeCustomer.invoice_settings.default_payment_method,
        // eslint-disable-next-line camelcase
        capture_method: 'manual',
    });

    if (!paymentIntent.id) throw 'Error in transaction!';

    let newOffer;
    try {
        newOffer = new Offer({
            introSoundBits: await createSound(
                `intro_${consultant.id}_${customer.id}.wav`,
                data.intro,
                [customer.id, consultant.id]
            ),
            problemSoundBits: await createSound(
                `problem_${consultant.id}_${customer.id}.wav`,
                data.intro,
                [customer.id, consultant.id]
            ),
            budgetMinutes: data.budget,
            paymentIntentId: paymentIntent.id,
            customer: customer.id,
            consultant: consultant.id,
            price: consultant.businessProfile.price,
        });
    } catch (err) {
        error(err);
        return {};
    }

    await newOffer.save();

    return { clientSecret: paymentIntent.client_secret };
}
