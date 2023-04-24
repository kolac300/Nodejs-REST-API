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
  ownerID: { type: String }
});
const Contact = mongoose.model('contacts', contactsSchema);

const listContacts = async (ownerID, favorite, limit, page) => {
  let res;
  if (favorite === "true" || favorite === "false") {
    if (limit > 0 && page > 0 && limit || page) {
      const skip = page > 0 ? (page - 1) * limit : 0;
      res = await Contact.find({ ownerID, favorite }).skip(skip).limit(limit).exec().catch(err => console.error(err))
    } else {
      res = await Contact.find({ ownerID, favorite }).catch(err => console.error(err))
    }
  } else {
    if (limit > 0 && page > 0 && limit || page) {
      const skip = page > 0 ? (page - 1) * limit : 0;
      res = await Contact.find({ ownerID }).skip(skip).limit(limit).exec().catch(err => console.error(err))
    } else {
      res = await Contact.find({ ownerID }).catch(err => console.error(err))
    }
  }
  return res
};
const count = async (ownerID) => {
  return await Contact.countDocuments({ ownerID }).exec()
};

const getContactById = async (ownerID, contactId) => {
  const res = await Contact.findOne({ _id: contactId, ownerID }).catch(err => console.error(err));
  return res
};
const addContact = async (ownerID, body) => {
  console.log('first', { ...body, ownerID, })
  const res = await Contact.create({ ...body, ownerID, })
  return res
};
const removeContact = async (ownerID, contactId) => {
  const res = await Contact.findOneAndRemove({ _id: contactId, ownerID }).catch(err => console.error(err));
  return res
};
const updateContact = async (ownerID, contactId, body) => {
  const res = await Contact.findOneAndUpdate({ _id: contactId, ownerID }, body, { new: true }).catch(err => console.error(err));
  return res
};
const updateStatusContact = async (ownerID, contactId, body) => {
  const res = await Contact.findOneAndUpdate({ _id: contactId, ownerID }, body, { new: true }).catch(err => console.error(err));
  return res
};



module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
  count
};
