import {Chat, Message, User} from '../models/db'
import * as fs from "fs";
import {PythonShell} from "python-shell";

export async function newMessage(data, userID) {
    // check for the user and chat ID
    if (!data.chatId) throw 'Need a chatId!'
    if (!userID) throw 'need a user ID'

    let chat = await Chat.findById(data.chatId).populate()
    if (!chat) throw 'No chat by this ID'

    let user = await User.findById(userID)
    if (!user) throw 'No user by this ID'

    if ((chat.userAccount.toString() !== userID) && (chat.chatWithAccount.toString() !== userID)) throw 'This user isnt part of this chat!'

    let message = new Message({
        from: user.id,
        chatID: chat.id,
        message: data.message
    })

    await message.save()

    return message.toJSON()
}

export async function getMessages(data, userID) {
    //@TODO: optimize this check!
    if (!data.chatId) throw 'Need chat ID'
    if (!userID) throw 'need a user ID'

    let chat = await Chat.findById(data.chatId)

    if (!chat) throw 'No chat by this ID'

    if ((chat.userAccount.toString() !== userID) && (chat.chatWithAccount.toString() !== userID)) throw 'This user isnt part of this chat!'
    return Message.find({chatID: data.chatId}).populate({
        path: 'from',
        select: "firstName lastName email username"
    });

}

export async function sendingAudioMessage(data, userID) {
    if (!data.chatId) throw 'Need chat ID'
    if (!userID) throw 'need a user ID'

    // TODO: save the message and what not but skip for now
    let fileName = `${data.chatId}_${userID}.wav`
    let buff = Buffer.from(data.sound, 'base64');
    await fs.writeFileSync(fileName, buff)
    console.log(buff)
    let options = {
        mode: 'text',
        //TODO: amend for production
        //TODO: gitignore venv
        pythonPath: './services/py_speech/venv/Scripts/python.exe',
        args: [fileName, 'en_En']
    };
    PythonShell.run('./services/py_speech/speech_to_text.py', options, function (err, results) {
        console.log(err)
        console.log(results)
    })

    return "Text of speech"
}