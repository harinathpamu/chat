require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const Express = require("express");

const { port } = require("./config");
const dbconnector = require("./dbconnector/connector");

const UserRoutes = require("./api/users/routes");
const GroupsRoutes = require("./api/groups/routes");
const AuthorizationRoutes = require("./api/authorization/routes");

const app = Express();
const PORT = process.env.PORT || port;

app.use(cors());
app.use(morgan("tiny"));
app.use(Express.json());

async function init() {
  await dbconnector
    .connect()
    .then(() => {
      console.log("Successfully connected to database");

      app.use("/", AuthorizationRoutes);
      app.use("/users", UserRoutes);
      app.use("/groups", GroupsRoutes);

      app.listen(PORT, () => {
        console.log("Server listening at PORT:", PORT);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

init();
