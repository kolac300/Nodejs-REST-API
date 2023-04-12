const fs = require("fs").promises;
const path = require("path");
const contactsPath = path.resolve("./models/contacts.json");
const { uid } = require("uid");

const listContacts = async () => {
  return JSON.parse(await fs.readFile(contactsPath, "utf-8"));
};

const getContactById = async (contactId) => {
  return JSON.parse(await fs.readFile(contactsPath, "utf-8")).filter(
    (el) => el.id === contactId
  );
};

const removeContact = async (contactId) => {
  let deletedItem;
  const filterArr = JSON.stringify(
    (await listContacts()).filter((el) => {
      if (el.id === contactId) {
        deletedItem = el;
      }
      return el.id !== contactId;
    })
  );
  await fs.writeFile(contactsPath, filterArr, "utf-8");
  return deletedItem;
};

const addContact = async (body) => {
  const newElement = { ...body, id: uid() };
  const updatedArr = JSON.stringify(
    (await listContacts()).concat([newElement])
  );
  await fs.writeFile(contactsPath, updatedArr, "utf-8");
  return newElement
};

const updateContact = async (contactId, body) => {
  ;
  let updatedElement;
  const updatedArr = JSON.stringify(
    (await listContacts()).map((el) => {
      if (el.id === contactId) {
        el = {
          ...el, ...body, id: contactId
        };
        updatedElement = el
      }
      return el;
    })
  );
  await fs.writeFile(contactsPath, updatedArr, "utf-8");
  return updatedElement;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
