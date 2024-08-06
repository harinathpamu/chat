const router = require("express").Router();

const UserController = require("./controllers/UserController");

const isAuthenticatedMiddleware = require("../../common/middlewares/IsAuthenticatedMiddleware");
const CheckPermissionMiddleware = require("../../common/middlewares/CheckPermissionMiddleware");

const { roles } = require("../../config");

router.use([
  isAuthenticatedMiddleware.check,
  CheckPermissionMiddleware.has(roles.ADMIN),
]);

router.get("/:userId", UserController.getUser);

router.get("/", UserController.getAllUsers);

router.delete("/:userId", UserController.deleteUser);

module.exports = router;
