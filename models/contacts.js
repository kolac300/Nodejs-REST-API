// const fs = require("fs").promises;
const mongoose = require('mongoose');

(async function conectToMongoDB() {
  await mongoose.connect(process.env.DB_URI)
  console.log('Conected to MongoDB')
})().catch(err => {
  console.error(err)
  return process.exit(1)
})
const contactsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: { type: String },
  phone: { type: Number },
  favorite: {
    type: Boolean,
    default: false,
  },
});
const Contact = mongoose.model('contacts', contactsSchema);
const listContacts = async () => {
  const res = await Contact.find().catch(err => console.error(err))
  return res
};
const getContactById = async (contactId) => {
  const res = await Contact.findOne({ _id: contactId }).catch(err => console.error(err));
  return res
};
const addContact = async (body) => {
  const res = await Contact.create(body)
  return res
};
const removeContact = async (contactId) => {
  const res = await Contact.findOneAndRemove({ _id: contactId }).catch(err => console.error(err));
  return res
};
const updateContact = async (contactId, body) => {
  const res = await Contact.findOneAndUpdate({ _id: contactId }, body, { new: true }).catch(err => console.error(err));
  return res
};
const updateStatusContact = async (contactId, body) => {
  const res = await Contact.findOneAndUpdate({ _id: contactId }, body, { new: true }).catch(err => console.error(err));
  return res
};



module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact
};
