const Ajv = require("ajv").default;

module.exports = {
  verify: (schema) => {
    if (!schema) {
      throw new Error("Schema not provided");
    }
    return (req, res, next) => {
      const { body } = req;
      const ajv = new Ajv({ allErrors: true });
      const validate = ajv.compile(schema);
      const isValid = validate(body);

      if (isValid) {
        return next();
      }

      return res.send({
        status: false,
        error: {
          message: `Invalid Payload: ${ajv.errorsText(validate.errors)}`,
        },
      });
    };
  },
};
