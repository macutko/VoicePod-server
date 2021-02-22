import { Chat, Message, Sound, User } from '../../models/db';
import fs from 'fs';
import getAudioDurationInSeconds from 'get-audio-duration';
import { error } from '../../utils/logging';

export async function sendNewMessageAndCreateChat(data, userId) {
    if (!data.to) throw 'Need a username to start a chat';
    if (!data.soundBits) throw 'Need a message';
    if (!userId) throw 'Security error';

    let toUser = await User.findOne({ username: data.to });
    if (!toUser) throw 'No user by this username';

    let newChat;

    newChat = await Chat.findOne().or([
        {
            $and: [{ type: 'free' }, { customer: userId }, { consultant: toUser.id }],
        },
        {
            $and: [{ type: 'free' }, { consultant: userId }, { customer: toUser.id }],
        },
    ]);

    if (newChat) {
        return newChat.id;
    }

    newChat = new Chat({
        customer: toUser.id,
        consultant: userId,
        type: 'free',
    });
    await newChat.save();

    let fileName = `${newChat.id}_${userId}.wav`;
    let buff = Buffer.from(data.soundBits, 'base64');
    await fs.writeFileSync(fileName, buff);
    let duration = parseFloat(
        (await getAudioDurationInSeconds(fileName)).toFixed(0)
    );

    try {
        fs.unlinkSync(fileName);
    } catch (err) {
        error(`Fialed to remove file ${err}`);
    }

    if (duration <= 0) throw 'Short audio';

    let newSound = new Sound({
        soundBits: data.soundBits,
        allowedUsers: [toUser.id, userId],
        durationInSeconds: duration,
    });
    await newSound.save();

    let newMessage = new Message({
        chatId: newChat.id,
        from: userId,
        sound: newSound.id,
        durationInSeconds: duration,
    });

    await newMessage.save();

    newChat.lastMessage = newMessage.id;

    await newChat.save();
    return newChat.id;
}
