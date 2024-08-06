const UserModel = require("../../../common/models/User");

module.exports = {
  getUser: (req, res) => {
    const {
      params: { userId },
    } = req;

    UserModel.findUser({ _id: userId })
      .then((user) => {
        return res.status(200).json({
          status: true,
          data: user.toJSON(),
        });
      })
      .catch((err) => {
        return res.status(404).json({
          status: false,
          error: {
            message: `Could not find any user with userId: \`${userId}\`.`,
          },
        });
      });
  },

  updateUser: (req, res) => {
    const {
      user: { userId },
      body: payload,
    } = req;

    if (!Object.keys(payload).length) {
      return res.status(400).json({
        status: false,
        error: {
          message: "Body is empty, hence can not update the user.",
        },
      });
    }

    UserModel.updateUser({ id: userId }, payload)
      .then(() => {
        return UserModel.findUser({ id: userId });
      })
      .then((user) => {
        return res.status(200).json({
          status: true,
          data: user.toJSON(),
        });
      })
      .catch((err) => {
        return res.status(500).json({
          status: false,
          error: err,
        });
      });
  },

  deleteUser: (req, res) => {
    const {
      params: { userId },
    } = req;

    UserModel.deleteUser({ _id: userId })
      .then((numberOfEntriesDeleted) => {
        if (numberOfEntriesDeleted.deletedCount === 0) {
          return res.status(404).json({
            status: false,
            error: {
              message: `Could not find any user with userId: \`${userId}\`.`,
            },
          });
        } else {
          return res.status(200).json({
            status: true,
            data: {
              numberOfUsersDeleted: numberOfEntriesDeleted,
            },
          });
        }
      })
      .catch((err) => {
        return res.status(500).json({
          status: false,
          error: err,
        });
      });
  },

  getAllUsers: (_req, res) => {
    UserModel.findAllUsers()
      .then((users) => {
        return res.status(200).json({
          status: true,
          data: users,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          status: false,
          error: err,
        });
      });
  },
};
