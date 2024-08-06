const request = require("supertest");

const BASE_URL = "http://localhost:3000/";

const RANDOM_ID = () => Math.floor(Math.random() * 1000);

const TEST_USER = {
  username: `test-user-${RANDOM_ID()}`,
  password: "user-password",
  role: "user",
};

const TEST_ADMIN_USER = {
  username: `test-admin-${RANDOM_ID()}`,
  password: "admin-password",
  role: "admin",
};

describe("Authorization api's", () => {
  test("should register user", async () => {
    const response = await request(`${BASE_URL}`)
      .post("register")
      .send({
        username: TEST_USER.username + "register",
        email: "testuser@gmail.com",
        password: TEST_USER.password,
        firstName: "testUserFirstName",
        lastName: "testUserLastName",
        role: TEST_USER.role,
      });

    expect(response.body.data.user).toMatchObject({
      username: TEST_USER.username + "register",
      email: "testuser@gmail.com",
      firstName: "testUserFirstName",
      lastName: "testUserLastName",
      role: TEST_USER.role,
    });
  });

  test("should login user", async () => {
    const response = await request(`${BASE_URL}`)
      .post("login")
      .send({
        username: TEST_USER.username + "register",
        password: TEST_USER.password,
      });
    expect(response.body.data.user).toMatchObject({
      username: TEST_USER.username + "register",
      email: "testuser@gmail.com",
      firstName: "testUserFirstName",
      lastName: "testUserLastName",
      role: TEST_USER.role,
    });
  });
});

describe("Users api's", () => {
  let token = null;
  let userId = null;

  beforeAll(async () => {
    await request(`${BASE_URL}`).post("register").send({
      username: TEST_ADMIN_USER.username,
      email: "testadmin@gmail.com",
      password: TEST_ADMIN_USER.password,
      firstName: "testAdminFirstName",
      lastName: "testAdminLastName",
      role: TEST_ADMIN_USER.role,
    });
    const loginAdminResponse = await request(`${BASE_URL}`).post("login").send({
      username: TEST_ADMIN_USER.username,
      password: TEST_ADMIN_USER.password,
    });
    token = loginAdminResponse.body.data.token;
  });

  test("should not allow normal users", async () => {
    const loginResponse = await request(`${BASE_URL}`)
      .post("login")
      .send({
        username: TEST_USER.username + "register",
        password: TEST_USER.password,
      });

    const usersResponse = await request(`${BASE_URL}`)
      .get("users")
      .set("Authorization", `Bearer ${loginResponse.body.data.token}`);

    expect(usersResponse.body.error).toBe(
      "You need to be a admin to access this endpoint."
    );
  });

  test("should get all users", async () => {
    const usersResponse = await request(`${BASE_URL}`)
      .get("users")
      .set("Authorization", `Bearer ${token}`);
    userId = usersResponse.body.data[0]._id;
    expect(usersResponse.body.data).not.toBeNull();
  });

  test("should get existing user", async () => {
    const usersResponse = await request(`${BASE_URL}`)
      .get(`users/${userId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(usersResponse.body.data).not.toBeNull();
    expect(usersResponse.body.data._id).toBe(userId);
  });

  test("should fail to get on non existing user", async () => {
    const usersResponse = await request(`${BASE_URL}`)
      .get(`users/66abf0166114e61fcd4e9da8`)
      .set("Authorization", `Bearer ${token}`);
    expect(usersResponse.status).toBe(404);
  });

  test("should delete existing user", async () => {
    const registerUserResponse = await request(`${BASE_URL}`)
      .post("register")
      .send({
        username: "delete-user",
        email: "delete@gmail.com",
        password: "delete",
        firstName: "deleteUserFirstName",
        lastName: "deleteUserLastName",
        role: "user",
      });
    const userId = registerUserResponse.body.data.user._id;
    const usersResponse = await request(`${BASE_URL}`)
      .delete(`users/${userId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(usersResponse.body.data.numberOfUsersDeleted.deletedCount).toBe(1);
  });
});

describe("Groups api's", () => {
  let token = null;
  let groupId = null;
  let userId = null;
  beforeAll(async () => {
    const loginResponse = await request(`${BASE_URL}`)
      .post("login")
      .send({
        username: TEST_USER.username + "register",
        password: TEST_USER.password,
      });
    token = loginResponse.body.data.token;
  });

  test("should add group", async () => {
    const groupResponse = await request(`${BASE_URL}`)
      .post("groups")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "test-group",
      });
    groupId = groupResponse.body.data._id;
    expect(groupResponse.body.data.name).toBe("test-group");
  });

  test("should get group", async () => {
    const groupResponse = await request(`${BASE_URL}`)
      .get(`groups/${groupId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(groupResponse.body.data.name).toBe("test-group");
  });

  test("should fail to get non existing group", async () => {
    const groupResponse = await request(`${BASE_URL}`)
      .get(`groups/66abf0166114e61fcd4e9da8`)
      .set("Authorization", `Bearer ${token}`);
    expect(groupResponse.status).toBe(404);
  });

  test("should get all groups", async () => {
    const groupsResponse = await request(`${BASE_URL}`)
      .get("groups")
      .set("Authorization", `Bearer ${token}`);
    expect(groupsResponse.body.data).not.toBeNull();
  });

  test("should delete group", async () => {
    const addGroupResponse = await request(`${BASE_URL}`)
      .post("groups")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "delete-group",
      });
    const groupId = addGroupResponse.body.data._id;
    const deleteGroupResponse = await request(`${BASE_URL}`)
      .delete(`groups/${groupId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(
      deleteGroupResponse.body.data.numberOfUsersDeleted.deletedCount
    ).toBe(1);
  });

  test("should add user to group", async () => {
    const registerUserResponse = await request(`${BASE_URL}`)
      .post("register")
      .send({
        username: `add-user-to-group-user-${Math.floor(Math.random() * 1000)}`,
        email: "addusertogroup@gmail.com",
        password: "addusertogroup",
        firstName: "addUserToGroupFirstName",
        lastName: "addUserToGroupLastName",
        role: "user",
      });

    userId = registerUserResponse.body.data.user._id;

    const addUserToGroupResponse = await request(`${BASE_URL}`)
      .patch(`groups/${groupId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        userId: userId,
      });

    expect(addUserToGroupResponse.body.data.users).toContain(userId);
  });

  test("should not add user which doesn't exists to group", async () => {
    const userId = "66abf0166114e61fcd4e9da8";
    const addUserToGroupResponse = await request(`${BASE_URL}`)
      .patch(`groups/${groupId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        userId: userId,
      });
    expect(addUserToGroupResponse.body.error.message).toBe(
      `Could not find any user with userId: \`${userId}\`.`
    );
  });

  test("should add message to group", async () => {
    const addMessageToGroupResponse = await request(`${BASE_URL}`)
      .put(`groups/${groupId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        userId,
        message: "add-test-message-to-group",
      });
    expect(addMessageToGroupResponse.body.data.messages[0].message).toBe(
      "add-test-message-to-group"
    );
  });
});
