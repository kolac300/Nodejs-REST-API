const express = require("express");
const path = require("path");
const Joi = require('joi');

const schemaPost = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().regex(/^\d{12}$/).required().messages({
    'string.pattern.base': 'Please provide a valid phone number in format 380735520102',
  }),
  email: Joi.string().email().required()
});
const schemaPut = Joi.object({
  name: Joi.string(),
  phone: Joi.string().regex(/^\d{12}$/).messages({
    'string.pattern.base': 'Please provide a valid phone number in format 380735520102',
  }),
  email: Joi.string().email()
});

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require(path.resolve("./models/contacts"));

const router = express.Router();

router.get("/", async (req, res, next) => {
  res.status(200).json(await listContacts());
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (!contact.length) {
    return res.status(404).json({ message: "Not found" });
  } else {
    return res.status(200).json(contact);
  }
});

router.post("/", async (req, res, next) => {
  const { name, email, phone } = req.body;

  const result = schemaPost.validate({ name, email, phone });

  if (result.error) {
    return res.status(400).json({ message: result.error.details })
  }
  if (name.trim() && email.trim() && phone.trim()) {
    return res.status(201).json(await addContact({ name, email, phone }));
  } else {
    return res.status(400).json({ message: "missing required name field" })

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
  const updatedContact = await updateContact(contactId, req.body);
  if (Object.keys(req.body).length && updatedContact) {
    return res.json(updatedContact);
  } else if (!updatedContact) {
    return res.status(404).json({ message: "Not found" });
  } else {
    return res.status(400).json({ message: "missing fields" });
  }
});

module.exports = router;
