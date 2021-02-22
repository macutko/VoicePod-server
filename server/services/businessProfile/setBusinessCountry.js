import { Config } from '../../config';
import { __getUserAndProfileById } from './_util';

export async function setBusinessCountry(data, userId) {
    if (!data.country) throw 'Need a country';
    // eslint-disable-next-line no-unused-vars
    let [user, profile] = await __getUserAndProfileById(userId);

    let conf = new Config();

    const countrySpec = await conf.stripe.countrySpecs.retrieve(data.country);
    profile.currency = countrySpec.default_currency;

    profile.country = data.country;
    await profile.save();
    return true;
}
