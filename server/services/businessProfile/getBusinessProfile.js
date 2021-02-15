import {User} from "../../models/db";

export async function getBusinessProfile(data) {
    if (!data.email) throw 'Need email'
    if (!data.username) throw 'Need username'

    let user = await User.findOne().and([{username: data.username}, {email: data.email}, {businessActivated: true}]).populate({path: 'businessProfile'})

    if (!user) throw 'No such user'
    // console.log(`getBusinessprofile user ${user}`)

    // console.log(`getBusinessprofile profile ${profile}`)
    return user.businessProfile
}
