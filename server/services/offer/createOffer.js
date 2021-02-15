import {Config} from "../../config";
import {Offer, User} from "../../models/db";

let config = new Config()





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
