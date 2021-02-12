import {User} from "../../models/db";


export async function searchUser(queryString, userID) {
    let finds;
    finds = await User.find().and({"businessActivated": true}).or([{'username': {$regex: queryString, $options: "i"}},
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
