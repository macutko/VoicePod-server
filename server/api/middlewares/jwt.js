import expressJwt from 'express-jwt'
import {Config} from "../../config";
import {getById} from "../../services/user.service";


module.exports = jwt;

function jwt() {
    let conf = new Config();
    return expressJwt({secret: conf.secret, isRevoked}).unless({
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
    const user = await getById(payload.sub);

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
}
