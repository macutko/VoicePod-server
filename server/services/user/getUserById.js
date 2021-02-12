import {User} from "../../models/db";

export async function getUserById(id) {
    return User.findById(id);
}
