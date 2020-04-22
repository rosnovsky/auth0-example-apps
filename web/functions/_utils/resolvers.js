const ObjectId = require('mongodb').ObjectId;

module.exports = db => {
    return {
        Query: {
        apps: async () => await db
            .collection("apps")
            .find()
            .toArray(),
        app: async (root, args, context, info) => {
            const res = await db
            .collection("apps")
            .findOne(ObjectId(args._id)) 
            return res;
            }
        },
        Mutation: {
            createApp: async (root, args, context, info) => {
                const res = await db
                .collection("apps")
                .insertOne(args)
                return await db.collection("apps").findOne({_id: res.insertedId})
            },
            updateApp: async(root, args, input, info) => {
                const res = await db
                .collection("apps")
                .findOneAndUpdate({"_id": ObjectId(args._id)}, { $set: args.input })
                return await db.collection("apps").findOne(ObjectId(args._id))
            }
        },
    };
}