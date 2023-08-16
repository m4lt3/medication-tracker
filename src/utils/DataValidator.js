import Ajv from "ajv";
const ajv = new Ajv();

const validator = {};

const schemas = {
  pills: {
    type: "object",
    properties: {
      name: { type: "string" },
      contents: {
        type: "array",
        items: {
          type: "object",
          properties: {
            ingredient: { type: "number" },
            amount: { type: "number", minimum: 0 }
          },
          required: [ "ingredient", "amount" ],
          additionalProperties: false
        }
      },
      group: { type: "number" }
    },
    required: [ "name", "contents" ],
    additionalProperties: false
  },
  pillGroups: {
    type: "object",
    properties: {
      name: { type: "string" }
    },
    required: [ "name" ],
    additionalProperties: false
  },
  categories: {
    type: "object",
    properties: {
      name: { type: "string" },
      limit: { type: "number", minimum: 0 },
      expires: { type: "number", minimum: 0 }
    },
    required: [ "name", "limit", "expires" ],
    additionalProperties: false
  },
  intakes: {
    type: "object",
    properties: {
      pill: { type: "number" },
      takenAt: { type: "number" }
    },
    required: [ "pill", "takenAt" ],
    additionalProperties: false
  }
};

validator.validate = (schemaName, data) => {
  if (!schemas[schemaName]) {
    throw new Error(`Schema with name '${schemaName}' does not exist.`);
  }

  const validate = ajv.compile(schemas[schemaName]);
  const valid = validate(data);

  if (!valid) {
    return validate.errors;
  }

  return true;
}

export { validator };
