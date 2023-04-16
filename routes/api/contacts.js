const express = require("express");
const path = require("path");
const Joi = require('joi');

const schemaPost = Joi.object({
  name: Joi.string().required(),
  favorite: Joi.boolean(),
  phone: Joi.string().regex(/^\d{12}$/).required().messages({
    'string.pattern.base': 'Please provide a valid phone number in format 380735520102',
  }),
  email: Joi.string().email().required()
});
const schemaPut = Joi.object({
  name: Joi.string(),
  favorite: Joi.boolean(),
  phone: Joi.string().regex(/^\d{12}$/).messages({
    'string.pattern.base': 'Please provide a valid phone number in format 380735520102',
  }),
  email: Joi.string().email()
});
const schemaPatch = Joi.object({
  favorite: Joi.boolean().required(),
});

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact
} = require(path.resolve("./models/contacts"));

const router = express.Router();

router.get("/", async (req, res, next) => {
  res.status(200).json(await listContacts());
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  } else {
    return res.status(200).json(contact);
  }
});

router.post("/", async (req, res, next) => {
  const result = schemaPost.validate(req.body);
  if (result.error) {
    return res.status(400).json({ message: result.error.details })
  } else {
    return res.status(201).json(await addContact(req.body));
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const deletedItem = await removeContact(contactId);
  if (deletedItem) {
    return res.status(200).json({ message: "contact deleted" });
  } else {
    return res.status(404).json({ message: "Not found" });
  }
});

router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const result = schemaPut.validate(req.body);
  if (result.error) {
    return res.status(400).json({ message: result.error.details })
  }
  if (Object.keys(req.body).length && contactId) {
    const updatedContactInfo = await updateContact(contactId, req.body);
    return res.status(200).json(updatedContactInfo)
  } else if (!req.body) {
    return res.status(400).json({ message: "missing fields" });
  } else {
    return res.status(404).json({ message: "Not found" });
  }
});

router.patch("/:contactId/favorite", async (req, res, next) => {
  const { contactId } = req.params;
  const result = schemaPatch.validate(req.body);
  if (result.error) {
    return res.status(400).json({ message: result.error.details })
  }
  if (Object.keys(req.body).length && contactId) {
    const updatedStatusInfo = await updateStatusContact(contactId, req.body);
    return res.status(200).json(updatedStatusInfo)
  } else if (!req.body) {
    return res.status(400).json({ message: "missing field favorite" });
  } else {
    return res.status(404).json({ message: "Not found" });
  }
});

module.exports = router;
