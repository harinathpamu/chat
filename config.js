module.exports = {
  port: process.env.PORT,
  jwtSecret:process.env.JWT_SECRET ,
  jwtExpirationInSeconds: 60 * 60, // 1 hour
  roles: {
    USER: "user",
    ADMIN: "admin",
  },
};
