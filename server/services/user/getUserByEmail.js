import {User} from "../../models/db";

export async function getUserByEmail(value) {
    return User.findOne({"email": value});
}
