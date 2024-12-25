'use client'
import React, { createContext, useReducer, useEffect } from 'react';
import { openDB } from 'idb';

const ContactsContext = createContext();

const contactsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CONTACTS':
      return action.payload;
    case 'ADD_CONTACT':
      return [...state, action.payload];
    default:
      return state;
  }
};

const dbPromise = openDB('whatapp', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('contacts')) {
      db.createObjectStore('contacts', { keyPath: 'id' });
    }
  },
});

export const ContactsProvider = ({ children }) => {
  const [contacts, dispatch] = useReducer(contactsReducer, []);

  const loadContacts = async () => {
    try {
      const db = await dbPromise;
      const savedContacts = await db.getAll('contacts');
      dispatch({ type: 'SET_CONTACTS', payload: savedContacts });
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const addContact = async (contact) => {
    try {
      const db = await dbPromise;
      await db.put('contacts', contact);
      dispatch({ type: 'ADD_CONTACT', payload: contact });
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  return (
    <ContactsContext.Provider value={{ contacts, addContact, dispatch }}>
      {children}
    </ContactsContext.Provider>
  );
};

export default ContactsContext;
