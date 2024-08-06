const GroupModel = require("../../../common/models/Group");
const UserModel = require("../../../common/models/User");

module.exports = {
  createGroup: (req, res) => {
    const { body: payload } = req;

    GroupModel.createGroup(payload)
      .then((group) => {
        return res.status(200).json({
          status: true,
          data: group.toJSON(),
        });
      })
      .catch((err) => {
        return res.status(500).json({
          status: false,
          error: err,
        });
      });
  },

  getGroup: (req, res) => {
    const {
      params: { groupId },
    } = req;

    GroupModel.findGroup({ id: groupId })
      .then((group) => {
        return res.status(200).json({
          status: true,
          data: group.toJSON(),
        });
      })
      .catch((err) => {
        return res.status(404).json({
          status: false,
          error: {
            message: `Could not find any group with groupId: \`${groupId}\`.`,
          },
        });
      });
  },

  addUserToGroup: (req, res) => {
    const {
      body: payload,
      params: { groupId },
    } = req;

    if (!Object.keys(payload).length) {
      return res.status(400).json({
        status: false,
        error: {
          message: "Body is empty, hence can not update the group.",
        },
      });
    }

    const { userId } = payload;

    UserModel.findUser({ _id: userId })
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            status: false,
            error: {
              message: `Could not find any user with userId: \`${userId}\`.`,
            },
          });
        } else {
          UserModel.addGroupToUser({ id: userId }, groupId)
            .then(() => {
              return UserModel.findUser({ _id: userId });
            })
            .then(() => {
              GroupModel.addUserToGroup({ id: groupId }, userId)
                .then(() => {
                  return GroupModel.findGroup({ id: groupId });
                })
                .then((group) => {
                  return res.status(200).json({
                    status: true,
                    data: group.toJSON(),
                  });
                })
                .catch((err) => {
                  return res.status(500).json({
                    status: false,
                    error: err,
                  });
                });
            })
            .catch((err) => {
              return res.status(500).json({
                status: false,
                error: err,
              });
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

  addMessageToGroup: (req, res) => {
    const {
      body: payload,
      params: { groupId },
    } = req;

    UserModel.findUser({ _id: payload.userId })
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            status: false,
            error: {
              message: `Could not find any user with userId: \`${payload.userId}\`.`,
            },
          });
        } else {
          GroupModel.addMessageToGroup({ id: groupId }, payload)
            .then((group) => {
              return res.status(200).json({
                status: true,
                data: group.toJSON(),
              });
            })
            .catch((err) => {
              if (err.msg) {
                return res.status(404).json({
                  status: false,
                  error: err.msg,
                });
              } else {
                return res.status(500).json({
                  status: false,
                  error: err,
                });
              }
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

  deleteGroup: (req, res) => {
    const {
      params: { groupId },
    } = req;

    GroupModel.deleteGroup({ _id: groupId })
      .then((numberOfEntriesDeleted) => {
        if (numberOfEntriesDeleted.deletedCount === 0) {
          return res.status(404).json({
            status: false,
            error: {
              message: `Could not find any group with groupId: \`${groupId}\`.`,
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

  getAllGroups: (_req, res) => {
    GroupModel.findAllGroup()
      .then((groups) => {
        return res.status(200).json({
          status: true,
          data: groups,
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
