import {Config} from "../../config";
import {User} from "../../models/db";

let config = new Config()


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
