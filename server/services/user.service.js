import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import {User} from '../models/db'
import {Config} from "../config";
import {sendNewBug} from "../utils/mailers";

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
    let query = {'_id': req.user.sub};
    let data = req.body
    let newData = {}
    if (data.profilePicture && data.pictureType) {
        // TODO: check that this is a file that works
        newData.profilePicture = data.profilePicture
        newData.pictureType = data.pictureType
    }
    if (data.firstName) {
        newData.firstName = data.firstName
    }
    if (data.lastName) {
        newData.lastName = data.lastName
    }
    if (data.description) {
        newData.description = data.description
    }
    if (data.businessActivated != null || data.businessActivated !== undefined) {
        newData.businessActivated = data.businessActivated
        if (newData.businessActivated) {
            let conf = new Config()

            const Stripe = require('stripe');
            const stripe = Stripe(conf.stripeSecret);

            const account = await stripe.accounts.create({
                type: 'standard',
            });
            console.log(account)
        }
    }
    if (data.price != null || data.price !== undefined) {
        if (data.price > 0 && !isNaN(data.price)) {
            newData.price = data.price
        }
    }
    return User.findOneAndUpdate(query, newData, {new: true});
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
    if (user && bcrypt.compareSync(password, user.hash)) {
        let config = new Config()
        const token = jwt.sign({sub: user.id}, config.secret);
        let u = user.toJSON()
        delete u.id
        return {
            user: u,
            token: token
        };
    }
}

export async function getById(id) {
    let user = await User.findById(id);
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

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    } else {
        throw ' Password undefined'
    }

    // save user
    let token;
    let config = new Config()
    await user.save().then((newUser) => {
        token = jwt.sign({sub: newUser.id}, config.secret);
    });

    return {
        user: user.toJSON(),
        token: token
    };
}


