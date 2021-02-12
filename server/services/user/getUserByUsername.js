import {User} from "../../models/db";

export async function getUserByUsername(value) {
    return User.findOne({"username": value.toLowerCase()});
}
