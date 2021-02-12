import {Config} from "../../config";
import {User} from "../../models/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

let config = new Config();


export async function createUser(userParam) {
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
