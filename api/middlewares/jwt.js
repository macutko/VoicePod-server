import expressJwt from 'express-jwt'
import {config} from '../../config.js'
import userService from '../../services/user.service'


module.exports = jwt;

function jwt() {
    const secret = config.secret;
    return expressJwt({secret, isRevoked}).unless({
        path: [
            // public routes that don't require authentication
            '/user/authenticate',
            '/user/create',
            '/user/exists',
            '/client-error/'
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await userService.getById(payload.sub);

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
}
