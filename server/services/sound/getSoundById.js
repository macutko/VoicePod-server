import { Sound } from '../../models/db';

export async function getSoundById(data, userId) {
    let sound = await Sound.findById(data.id);
    if (!sound) throw 'no such sound';
    if (sound.allowedUsers.includes(userId)) {
        return sound;
    }
    throw 'User not allowed to view this sound';
}
