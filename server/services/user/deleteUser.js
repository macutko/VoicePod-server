import {User} from "../../models/db";

export async function deleteUser(userID) {
    let query = {'_id': userID};
    let newData = {
        profilePicture: null,
        confirmedEmail: false,
        language: "en-EN",
        businessActivated: false,
        description: ' ',
        price: 0.5,
        searchTags: [],
        firstName: 'Deleted',
        lastName: 'user',
        email: ` `,
        username: `${userID}`,
        pictureType: 'jpg'
    }

    return User.findOneAndUpdate(query, newData);
}
