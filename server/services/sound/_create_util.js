import {Sound} from "../../models/db";
import fs from "fs";
import getAudioDurationInSeconds from "get-audio-duration";

/**
 * helper function to create a sound object
 * @param fileName name of file for operation purpose
 * @param soundBits the actual sound bits
 * @param userIds list of users
 * @returns {Promise<string>}
 */
export async function createSound(fileName, soundBits, userIds) {
    if (!Array.isArray(userIds) || userIds.length === 0) throw 'Need permissions here'

    let buff = Buffer.from(soundBits, 'base64');
    await fs.writeFileSync(fileName, buff)
    let duration = parseFloat((await getAudioDurationInSeconds(fileName)).toFixed(0))

    fs.unlinkSync(fileName)

    if (duration <= 0) throw 'Short audio'

    let sound = new Sound({soundBits: soundBits, allowedUsers: userIds, durationInSeconds: duration})
    await sound.save()

    return sound.id
}
