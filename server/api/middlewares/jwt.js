import expressJwt from 'express-jwt'
import {Config} from "../../config";
import {getUserById} from "../../services/user";

export default function jwt() {
    let conf = new Config();
    return expressJwt({secret: conf.secret, isRevoked}).unless({
        path: [
            // public routes that don't require authentication
            '/user/authenticateUser',
            '/user/createUser',
            '/user/exists',
            '/client-error/',
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await getUserById(payload.sub);

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
}
