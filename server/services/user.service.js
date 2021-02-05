import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {BusinessProfile, User} from '../models/db'
import {Config} from "../config";

let config = new Config();

export async function updateUser(req) {

    let data = req.body
    let user = await User.findById(req.user.sub).populate({path: 'businessProfile'})
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
    let accountLinks;
    if (data.businessActivated != null || data.businessActivated !== undefined) {
        user.businessActivated = data.businessActivated

        if (data.businessActivated && !user.businessProfile) {

            const account = await config.stripe.accounts.create({
                type: 'express',
            });

            let new_BusinessProfile = new BusinessProfile({stripeId: account.id})
            await new_BusinessProfile.save()
            user.businessProfile = new_BusinessProfile.id


            accountLinks = await config.stripe.accountLinks.create({
                account: account.id,
                refresh_url: 'https://example.com/reauth',
                return_url: 'https://example.com/return',
                type: 'account_onboarding',
            });
        } else if (data.businessActivated && user.businessProfile) {
            const account = await config.stripe.accounts.retrieve(user.businessProfile.stripeId);

            accountLinks = await config.stripe.accountLinks.create({
                account: account.id,
                refresh_url: 'https://example.com/reauth',
                return_url: 'https://example.com/return',
                type: 'account_onboarding', //change to update
            });
        }
    }


    await user.save()

    if (accountLinks && accountLinks.url) {
        return {url: accountLinks.url}
    }
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
    return User.findById(id);
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
