import { checkSchema } from "express-validator";

export const createManufacturerValidator = checkSchema({
  
  "variables.input.name": {
    in: ["body"],
    isString: { errorMessage: "name måste vara text" },
    trim: true,
    isLength: { options: { min: 1, max: 120 }, errorMessage: "name 1–120 tecken" },
  },
  "variables.input.country": {
    in: ["body"],
    isString: { errorMessage: "country måste vara text" },
    trim: true,
    notEmpty: { errorMessage: "country är obligatoriskt" },
  },
  "variables.input.website": {
    in: ["body"],
    isURL: { errorMessage: "ogiltig webbadress" },
    trim: true,
  },
  "variables.input.description": {
    in: ["body"],
    isString: { errorMessage: "description måste vara text" },
    trim: true,
    isLength: { options: { min: 1, max: 500 }, errorMessage: "description 1–500 tecken" },
  },
  "variables.input.address": {
    in: ["body"],
    isString: { errorMessage: "address måste vara text" },
    trim: true,
    notEmpty: { errorMessage: "address är obligatoriskt" },
  },

  // Nested Create Contact 
  "variables.input.contact.name": {
    in: ["body"],
    isString: { errorMessage: "contact.name måste vara text" },
    trim: true,
    isLength: { options: { min: 1, max: 120 }, errorMessage: "contact.name 1–120 tecken" },
  },
  "variables.input.contact.email": {
    in: ["body"],
    isEmail: { errorMessage: "ogiltig e-post" },
    normalizeEmail: true,
  },
  "variables.input.contact.phone": {
    in: ["body"],
    matches: {
      options: [/^\+?[0-9 ()-]{6,20}$/],
      errorMessage: "ogiltigt telefonformat",
    },
    trim: true,
  },
});