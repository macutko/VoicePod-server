import {Config} from "../config";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import {sendNewBug} from "../utils/mailers";
import {BusinessProfile, User} from '../models/db'

let config = new Config()

export async function search(queryString, userID) {
    let finds;
    finds = await User.find().and({businessActivated: true}).or([{'username': {$regex: queryString, $options: "i"}},
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

export async function updateUser(req) {

    let data = req.body
    let user = await User.findById(req.user.sub)
    if (!user) throw "No such user!"

    if (data.profilePicture && data.pictureType) {
        // TODO: check that this is a file that works
        user.profilePicture = data.profilePicture
        user.pictureType = data.pictureType
    }
    if (data.firstName) {
        user.firstName = data.firstName
    }
    if (data.lastName) {
        user.lastName = data.lastName
    }
    if (data.description) {
        user.description = data.description
    }
    if (data.businessActivated != null || data.businessActivated !== undefined) {
        user.businessActivated = data.businessActivated

        if (data.businessActivated && !user.businessProfile) {

            const account = await config.stripe.accounts.create({
                type: 'express',
            });

            let new_BusinessProfile = new BusinessProfile({stripeId: account.id})
            await new_BusinessProfile.save()
            user.businessProfile = new_BusinessProfile.id
        }
    }


    await user.save()
    return user.toJSON()
}


export async function removeUser(userID) {
    let query = {'_id': userID};
    let newData = {
        profilePicture: null,
        confirmedEmail: false,
        language: "en-EN",
        businessActivated: false,
        description: ' ',
        price: 0.5,
        searchTags: [],
        firstName: 'Deleted',
        lastName: 'user',
        email: ` `,
        username: `${userID}`,
        pictureType: 'jpg'
    }

    return User.findOneAndUpdate(query, newData);
}

export async function authenticate({username, password}) {
    const user = await User.findOne({username});
    if (user) {
        if (bcrypt.compareSync(password, user.hash)) {
            const token = jwt.sign({sub: user.id}, config.secret);
            let u = user.toJSON();
            delete u.id;
            console.log(u.username);
            return {
                user: u,
                token: token,
                errCode: null
            };
        } else {
            return {user: '', token: '', errCode: 401}
        }
    } else {
        return {user: '', token: '', errCode: 404}
    }
}

export async function getById(id) {
    let user = await User.findById(id)

    if (user) {
        user = user.toJSON()
        delete user.id
    }
    return user
}


export async function getByEmail(value) {
    return User.findOne({"email": value});
}

export async function getByUsername(value) {
    return User.findOne({"username": value.toLowerCase()});
}

export async function create(userParam) {
    // validate
    if (await User.findOne({username: userParam.username})) {
        throw 'Username "' + userParam.username.toLowerCase() + '" is already taken';
    }
    if (userParam.email === undefined) {
        throw 'Email must be defined!'
    } else if (await User.findOne({email: userParam.email})) {
        throw 'Email "' + userParam.email + '" is already used by another user';
    }


    const customer = await config.stripe.customers.create({
        email: userParam.email,
        name: userParam.username
    });

    userParam.stripeCustomerId = customer.id

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    } else {
        throw ' Password undefined'
    }

    // save user
    let token;

    await user.save().then((newUser) => {
        token = jwt.sign({sub: newUser.id}, config.secret);
    });

    return {
        user: user.toJSON(),
        token: token
    };
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
