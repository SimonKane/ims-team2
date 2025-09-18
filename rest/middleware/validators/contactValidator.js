// validators/contacts/createContact.validator.js
import { checkSchema } from "express-validator";

export const createContactValidator = checkSchema({
  "variables.input.name": {
    in: ["body"],
    exists: { errorMessage: "name saknas" },
    isString: { errorMessage: "name måste vara text" },
    trim: true,
    isLength: {
      options: { min: 1, max: 120 },
      errorMessage: "name 1–120 tecken",
    },
  },

  "variables.input.email": {
    in: ["body"],
    isEmail: { errorMessage: "ogiltig e-post" },
    normalizeEmail: true,
  },

  "variables.input.phone": {
    in: ["body"],
    exists: { errorMessage: "phone saknas" },
    notEmpty: { errorMessage: "phone får inte vara tomt" },
    trim: true,
    matches: {
      options: [/^\+[1-9][0-9]{6,14}$/],
      errorMessage: "ogiltigt telefonformat (ex: +46701234567)",
    },
  },
});
