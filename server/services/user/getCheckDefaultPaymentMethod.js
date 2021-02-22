import {Config} from "../../config";
import {User} from "../../models/db";

let config = new Config()


export async function getCheckDefaultPaymentMethod(data, userId) {

    let user = await User.findById(userId)

    if (!user) throw 'Security Alert'

    let payment = await config.stripe.customers.retrieve(user.stripeCustomerId)

    return !!payment.invoice_settings.default_payment_method

}
