import { User } from '../../models/db';
import { Config } from '../../config';

let config = new Config();
export async function setDefaultPaymentMethod(data, userId) {
    let user = await User.findById(userId);
    if (!user) throw 'no such user!';
    if (!data.paymentMethod) throw 'Need a payment method';

    await config.stripe.customers.update(user.stripeCustomerId, {
    // eslint-disable-next-line camelcase
        invoice_settings: { default_payment_method: data.paymentMethod },
    });

    return true; // TODO: return smthing meaningful
}
