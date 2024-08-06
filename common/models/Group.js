const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    name: { type: String, required: true },
    messages: [
      {
        userId: { type: String, required: true },
        message: { type: String, required: true },
      },
    ],
    users: [String],
    insertedAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: Date.now },
  },
  { timestamps: false, versionKey: false }
);

const GroupModel = mongoose.model("group", schema);

module.exports = {
  createGroup: (group) => {
    const model = new GroupModel({ ...group });
    return model.save();
  },

  findGroup: (query) => {
    return GroupModel.findById(query.id);
  },

  updateGroup: (query) => {
    return GroupModel.updateOne(query);
  },

  addUserToGroup: async (query, payload) => {
    const doc = await GroupModel.findById(query.id);
    const isExisting = doc.users.some((value) => value === payload);
    if (!isExisting) {
      doc.users = [...doc.users, payload];
    }
    return doc.save();
  },

  addMessageToGroup: async (query, payload) => {
    const doc = await GroupModel.findById(query.id);
    const userExists = doc.users.some((user) => payload.userId === user);
    if (userExists) {
      doc.messages = [...doc.messages, payload];
      return doc.save();
    } else {
      return Promise.reject({
        msg: `User:${payload.userId} doesn't exists in the group:${query.id}`,
      });
    }
  },

  findAllGroup: () => {
    return GroupModel.find();
  },

  deleteGroup: (query) => {
    return GroupModel.deleteOne(query);
  },
};
