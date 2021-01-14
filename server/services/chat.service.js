import {Chat, Message, User} from '../models/db'


module.exports = {
    getChatByUserId: getByUserId,
    createChat,
};

async function getByUserId(userID) {
    let chat = await Chat.find({$or: [{'userAccount': userID}, {'chatWithAccount': userID}]})
    let responseChats = []
    if (chat !== []) {
        for (let item of chat) {
            let user;
            if (item.userAccount === userID) user = item.chatWithAccountUsername

            if (item.chatWithAccount === userID) user = item.userAccountUsername
            responseChats.push({
                username: user,
                chatId: item._id
            })
        }

    }

    return responseChats
}

async function createChat(req) {
    // validate
    if (req.body.message == null) throw 'message must be something!'
    if (req.user === undefined) throw 'user must be defined'
    if (req.body.username == null) throw 'user must be defined'


    let destinationUser = await User.findOne({username: req.body.username})
    if (destinationUser == null) {
        throw 'no user by this name!'
    }

    let currentUser = await User.findById(req.user.sub)

    let chat = await Chat.find({
        $or: [{'userAccountUsername': currentUser.username},
            {'userAccountUsername': destinationUser.username},
            {'chatWithAccountUsername': currentUser.username},
            {'chatWithAccountUsername': destinationUser.username}]
    })

    if (chat.length !== 0 ) return chat

    let newChat = new Chat({
        userAccount: req.user.sub,
        chatWithAccount: destinationUser._id,
        userAccountUsername: currentUser.username,
        chatWithAccountUsername: destinationUser.username

    })


    newChat = await newChat.save()

    let newMessage = new Message({
        from: currentUser.id,
        chatID: newChat.id,
        message: req.body.message
    })

    return await newMessage.save()
}

