const router = require("express").Router();

const AuthorizationController = require("./controllers/AuthorizationController");

const SchemaValidationMiddleware = require("../../common/middlewares/SchemaValidationMiddleware");

const loginPayload = require("./schemas/loginPayload");
const registerPayload = require("./schemas/registerPayload");

router.post(
  "/register",
  [SchemaValidationMiddleware.verify(registerPayload)],
  AuthorizationController.register
);

router.post(
  "/login",
  [SchemaValidationMiddleware.verify(loginPayload)],
  AuthorizationController.login
);

module.exports = router;
