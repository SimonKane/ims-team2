import { checkSchema } from "express-validator";

export const createProductValidator = checkSchema({
  "variables.productInput.name": {
    in: ["body"],
    isString: { errorMessage: "name måste vara text" },
    trim: true,
    isLength: {
      options: { min: 1, max: 120 },
      errorMessage: "name 1–120 tecken",
    },
  },
  "variables.productInput.sku": {
    in: ["body"],
    matches: {
      options: [/^[a-zA-Z0-9-]{3,20}$/],
      errorMessage:
        "sku får bara innehålla A–Z, 0–9 och bindestreck, 3–20 tecken",
    },
    trim: true,
  },
  "variables.productInput.description": {
    in: ["body"],
    isString: { errorMessage: "description måste vara text" },
    trim: true,
    isLength: {
      options: { min: 1, max: 500 },
      errorMessage: "description 1–500 tecken",
    },
  },
  "variables.productInput.price": {
    in: ["body"],
    isFloat: {
      options: { min: 0 },
      errorMessage: "price måste vara ett nummer ≥ 0",
    },
    toFloat: true,
  },
  "variables.productInput.category": {
    in: ["body"],
    isString: { errorMessage: "category måste vara text" },
    trim: true,
    notEmpty: { errorMessage: "category är obligatoriskt" },
  },
  "variables.productInput.amountInStock": {
    in: ["body"],
    isInt: {
      options: { min: 0 },
      errorMessage: "amountInStock måste vara ett heltal ≥ 0",
    },
    toInt: true,
  },

  //---- Om man vill kunna skapa Manufacturer och Contact samtidigt som man skapar en ny Product -------//

  // Manufacturer input (nested)
  // "variables.input.manufacturer.name": {
  //   in: ["body"],
  //   isString: { errorMessage: "manufacturer.name måste vara text" },
  //   trim: true,
  //   isLength: {
  //     options: { min: 1, max: 120 },
  //     errorMessage: "manufacturer.name 1–120 tecken",
  //   },
  // },
  // "variables.input.manufacturer.country": {
  //   in: ["body"],
  //   isString: { errorMessage: "manufacturer.country måste vara text" },
  //   trim: true,
  //   notEmpty: { errorMessage: "manufacturer.country är obligatoriskt" },
  // },
  // "variables.input.manufacturer.website": {
  //   in: ["body"],
  //   isURL: { errorMessage: "ogiltig webbadress för manufacturer" },
  //   trim: true,
  // },
  // "variables.input.manufacturer.description": {
  //   in: ["body"],
  //   isString: { errorMessage: "manufacturer.description måste vara text" },
  //   trim: true,
  //   isLength: {
  //     options: { min: 1, max: 500 },
  //     errorMessage: "manufacturer.description 1–500 tecken",
  //   },
  // },
  // "variables.input.manufacturer.address": {
  //   in: ["body"],
  //   isString: { errorMessage: "manufacturer.address måste vara text" },
  //   trim: true,
  //   notEmpty: { errorMessage: "manufacturer.address är obligatoriskt" },
  // },

  // Nested contact inside manufacturer
  // "variables.input.manufacturer.contact.name": {
  //   in: ["body"],
  //   isString: { errorMessage: "contact.name måste vara text" },
  //   trim: true,
  //   isLength: {
  //     options: { min: 1, max: 120 },
  //     errorMessage: "contact.name 1–120 tecken",
  //   },
  // },
  // "variables.input.manufacturer.contact.email": {
  //   in: ["body"],
  //   isEmail: { errorMessage: "ogiltig e-post för contact" },
  //   normalizeEmail: true,
  // },
  // "variables.input.manufacturer.contact.phone": {
  //   in: ["body"],
  //   matches: {
  //     options: [/^\+?[0-9 ()-]{6,20}$/],
  //     errorMessage: "ogiltigt telefonformat för contact",
  //   },
  //   trim: true,
  // },
});
