import { User } from '../../models/db';
import { Config } from '../../config';

let config = new Config();
export async function setAddPaymentMethod(data, userId) {
    let user = await User.findById(userId);
    if (!user) throw 'no such user!';
    if (!data.paymentMethod) throw 'Need a payment method';

    const setupIntent = await config.stripe.setupIntents.create({
    // eslint-disable-next-line camelcase
        payment_method_types: ['card'],
        customer: user.stripeCustomerId,
        // eslint-disable-next-line camelcase
        payment_method: data.paymentMethod,
    });

    // console.log('pre update')
    // await config.stripe.customers.update(
    //     user.stripeCustomerId,
    //     {invoice_settings: {default_payment_method: data.paymentMethod}}
    // );

    return setupIntent.client_secret;
}
