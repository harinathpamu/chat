const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    groups: [String],
    insertedAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: Date.now },
  },
  { timestamps: false, versionKey: false }
);

const UserModel = mongoose.model("user", schema);

module.exports = {
  createUser: (user) => {
    const model = new UserModel({ ...user });
    return model.save();
  },

  findUser: (query) => {
    return UserModel.findOne(query);
  },

  updateUser: (payload) => {
    return UserModel.updateOne(payload);
  },

  addGroupToUser: async (query, payload) => {
    const doc = await UserModel.findById(query.id);
    const isExisting = doc.groups.some((value) => value === payload);
    if (!isExisting) {
      doc.groups = [...doc.groups, payload];
    }
    return doc.save();
  },

  findAllUsers: () => {
    return UserModel.find();
  },

  deleteUser: (query) => {
    return UserModel.deleteOne(query);
  },
};
