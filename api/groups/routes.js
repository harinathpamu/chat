const router = require("express").Router();

const isAuthenticatedMiddleware = require("../../common/middlewares/IsAuthenticatedMiddleware");
const SchemaValidationMiddleware = require("../../common/middlewares/SchemaValidationMiddleware");

const GroupController = require("./controllers/GroupController");

const createGroupPayload = require("./schemas/createGroupPayload");
const addUserToGroupPayload = require("./schemas/addUserToGroupPayload");
const addMsgToGroupPayload = require("./schemas/addMsgToGroupPayload");

router.use([isAuthenticatedMiddleware.check]);

router.get("/", GroupController.getAllGroups);

router.post(
  "/",
  [SchemaValidationMiddleware.verify(createGroupPayload)],
  GroupController.createGroup
);

router.get("/:groupId", GroupController.getGroup);

router.delete("/:groupId", GroupController.deleteGroup);

router.patch(
  "/:groupId",
  [SchemaValidationMiddleware.verify(addUserToGroupPayload)],
  GroupController.addUserToGroup
);

router.put(
  "/:groupId",
  [SchemaValidationMiddleware.verify(addMsgToGroupPayload)],
  GroupController.addMessageToGroup
);

module.exports = router;
