module.exports = {
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    users: {
      type: "array",
      items: {
        type: "object",
        properties: {
          userId: { type: "string" },
        },
        required: ["userId"],
        additionalProperties: false,
      },
    },
    messages: {
      type: "array",
      items: {
        type: "object",
        properties: {
          userId: { type: "string" },
          message: { type: "string" },
        },
        required: ["userId", "message"],
        additionalProperties: false,
      },
    },
  },
  required: ["name"],
  additionalProperties: false,
};
