import {User} from "../models/db";
import {sendNewBug} from "../utils/mailers";
import {Config} from "../config";

let config = new Config()


export async function search(queryString, userID) {
    let finds;
    finds = await User.find().and({"businessActivated": true}).or([{'username': {$regex: queryString, $options: "i"}},
        {'firstName': {$regex: queryString, $options: "i"}},
        {'lastName': {$regex: queryString, $options: "i"}},
        {'description': {$regex: queryString, $options: "i"}},
        {'searchTags': {$regex: queryString, $options: "i"}}]);

    let results = []

    if (finds.length !== 0) {
        for (const user in finds) {
            let u = finds[user]
            if (u.id !== userID) {
                u = u.toJSON()
                delete u.businessActivated
                delete u.id
                results.push(u)
            }
        }
    }
    return results

}

export async function contactSupport(data, userId) {
    if (!data.title) throw 'Need a title'
    if (!data.message) throw 'Need a message'
    let user = await User.findById(userId)
    if (user) {
        return await sendNewBug(`By: ${user.email}, Title: ${data.title}`, data.message)
    } else {
        return false
    }

}


export async function addPaymentMethod(data, userId) {

    let user = await User.findById(userId)
    if (!user) throw 'no such user!'
    if (!data.paymentMethod) throw 'Need a payment method'

    const setupIntent = await config.stripe.setupIntents.create({
        payment_method_types: ['card'],
        customer: user.stripeCustomerId,
        payment_method: data.paymentMethod
    });

    // console.log('pre update')
    // await config.stripe.customers.update(
    //     user.stripeCustomerId,
    //     {invoice_settings: {default_payment_method: data.paymentMethod}}
    // );

    return setupIntent.client_secret
}

export async function setDefaultPaymentMethod(data, userId) {

    let user = await User.findById(userId)
    if (!user) throw 'no such user!'
    if (!data.paymentMethod) throw 'Need a payment method'

    await config.stripe.customers.update(
        user.stripeCustomerId,
        {invoice_settings: {default_payment_method: data.paymentMethod}}
    );

    return true //TODO: return smthing meaningful
}

export async function getDefaultPaymentMethod(data, userId) {

    let user = await User.findById(userId)
    if (!user) throw 'no such user!'

    const customer = await config.stripe.customers.retrieve(
        user.stripeCustomerId,
    );

    if (!customer.invoice_settings.default_payment_method) return {}

    const paymentMethod = await config.stripe.paymentMethods.retrieve(
        customer.invoice_settings.default_payment_method
    );
    // const paymentMethods = await config.stripe.paymentMethods.list({});

    console.log(paymentMethod.data)
    return paymentMethod
}

export async function checkDefaultPaymentMethod(userId) {
    let user = await User.findById(userId)

    if (!user) throw 'Security Alert'

    let payment = await config.stripe.customers.retrieve(user.stripeCustomerId)

    return !!payment.invoice_settings.default_payment_method

}
