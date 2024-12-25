'use client';
import { openDB } from 'idb';

const dbPromise = openDB('whatapp', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('contacts')) {
      db.createObjectStore('contacts', { keyPath: 'id' });
    }
  },
});


export const useIndexedDB = () => {

  const addContact = async (contact) => {
    const db = await dbPromise;
    await db.put('contacts', contact);
  };

  const getMessages = async (contactId) => {
    const db = await dbPromise;
    return await db.getAllFromIndex('messages', 'contactId', contactId);
  };

  return { addContact, getMessages };
};
