import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import {User, UserSettings} from '../models/db'
import {error} from "../utils/logging";
import {Config} from "../config";


module.exports = {
    getById,
    create,
    getByEmail,
    getByUsername,
    authenticate
};

async function authenticate({username, password}) {
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

async function getById(id) {
    let user = await User.findById(id);
    if (user) {
        user = user.toJSON()
        delete user.id
    }
    return user
}


async function getByEmail(value) {
    return User.findOne({"email": value});
}

async function getByUsername(value) {
    return User.findOne({"username": value.toLowerCase()});
}

async function create(userParam) {
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
        let userSettings = new UserSettings({user: newUser.id})
        userSettings.save().catch(err => error(err))
    });

    return {
        user: user.toJSON(),
        token: token
    };
}


