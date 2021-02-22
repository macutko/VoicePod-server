import { User } from '../../models/db';

export async function searchBusinessUser(data, userID) {
    if (!data.searchQuery) throw 'need a search query!';
    let finds;
    finds = await User.find().or([
        {
            username: {
                $regex: data.searchQuery,
                $options: 'i',
            },
        },
        { firstName: { $regex: data.searchQuery, $options: 'i' } },
        { lastName: { $regex: data.searchQuery, $options: 'i' } },
        { description: { $regex: data.searchQuery, $options: 'i' } },
        { searchTags: { $regex: data.searchQuery, $options: 'i' } },
    ]);

    let results = [];

    if (finds.length !== 0) {
        for (const user in finds) {
            let u = finds[user];
            if (u.id !== userID) {
                u = u.toJSON();
                delete u.businessActivated;
                delete u.id;
                results.push(u);
            }
        }
    }
    return results;
}
