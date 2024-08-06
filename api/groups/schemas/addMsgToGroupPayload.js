module.exports = {
  type: "object",
  properties: {
    userId: {
      type: "string",
    },
    message: {
      type: "string",
    },
  },
  required: ["userId", "message"],
  additionalProperties: false,
};
