import {stripeCountryCodes} from "../utils/stripeCountryCode";
import {BusinessProfile, User} from "../models/db";
import {Config} from "../config";

async function __getUserAndProfileById(userId) {
    let user = await User.findById(userId)
    if (!user) throw 'No such user'
    let profile = await BusinessProfile.findById(user.businessProfile)
    if (!profile) throw 'No profile for this user'
    return [user, profile]
}

export async function getCountries() {
    return stripeCountryCodes
}

export async function getBusinessProfile(data) {
    if (!data.email) throw 'Need email'
    if (!data.username) throw 'Need username'

    let user = await User.findOne().and([{username: data.username}, {email: data.email}, {businessActivated: true}]).populate({path: 'businessProfile'})

    if (!user) throw 'No such user'
    // console.log(`getBusinessprofile user ${user}`)

    // console.log(`getBusinessprofile profile ${profile}`)
    return user.businessProfile
}

export async function setPrice(data, userId) {
    if (!data.price) throw 'need price'
    if (data.price <= 0 || isNaN(data.price)) throw 'Bad price format'

    let [user, profile] = await __getUserAndProfileById(userId)

    profile.price = data.price
    await profile.save()
    return true
}

export async function getPrice(userId) {
    let [user, profile] = await __getUserAndProfileById(userId)
    return [profile.price, profile.currency]
}

export async function getCountry(userId) {
    let [user, profile] = await __getUserAndProfileById(userId)
    return profile.country
}

export async function setCountry(data, userId) {
    if (!data.country) throw 'Need a country'
    let [user, profile] = await __getUserAndProfileById(userId)

    let conf = new Config()

    const countrySpec = await conf.stripe.countrySpecs.retrieve(
        data.country
    );
    profile.currency = countrySpec.default_currency

    profile.country = data.country
    await profile.save()
    return true
}