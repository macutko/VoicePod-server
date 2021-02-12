import {User} from "../../models/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function authenticateUser({username, password}) {
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
