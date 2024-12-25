'use client';
import React, { createContext, useReducer } from 'react';
import { openDB } from 'idb';

const MessagesContext = createContext();

const messagesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_MESSAGES':
      return action.payload;
    case 'ADD_MESSAGE':
      return [...state, action.payload];
    default:
      return state;
  }
};

const openMessagesDB = async () => {
  const db = await openDB('whatsapp', 2, {
    upgrade(db, oldVersion, newVersion) {
      console.log('Database upgraded: ', oldVersion, '->', newVersion);

      if (!db.objectStoreNames.contains('messages')) {
        const store = db.createObjectStore('messages', { keyPath: 'id' });
        store.createIndex('contactId', 'contactId');
        console.log('Created object store "messages"');
      }
    },
  });
  return db;
};

const getMessagesFromIndexedDB = async (contactId) => {
  try {
    const db = await openMessagesDB();
    const messages = await db.getAll('messages');
    console.log('Fetched messages from IndexedDB: ', messages);
    return messages.filter((msg) => msg.contactId === contactId);
  } catch (error) {
    console.error('Error fetching messages from IndexedDB:', error);
    return [];
  }
};

const saveMessageToIndexedDB = async (message) => {
  try {
    const db = await openMessagesDB();
    await db.put('messages', message);
  } catch (error) {
    console.error('Error saving message to IndexedDB:', error);
  }
};

export const MessagesProvider = ({ children }) => {
  const [messages, dispatch] = useReducer(messagesReducer, []);

  const fetchMessages = async (contactId) => {
    try {
      // const response = await fetch(`https://api.instantdb.com/app/499541d3-3b36-4478-a883-b3f84d1b1b50/messages/${contactId}`, {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/messages/${contactId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const messages = await response.json();
        dispatch({ type: 'SET_MESSAGES', payload: messages });
      } else {
        const localMessages = await getMessagesFromIndexedDB(contactId);
        dispatch({ type: 'SET_MESSAGES', payload: localMessages });
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      const localMessages = await getMessagesFromIndexedDB(contactId);
      dispatch({ type: 'SET_MESSAGES', payload: localMessages });
    }
  };

  // Send a new message and save it to both the server and IndexedDB
  const sendMessage = async (contactId, text) => {
    const message = { id: Date.now(), text, sender: 'me', contactId };

    try {
      // const response = await fetch(`https://api.instantdb.com/app/499541d3-3b36-4478-a883-b3f84d1b1b50/messages`, {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      });

      if (response.ok) {
        const savedMessage = await response.json();
        dispatch({ type: 'ADD_MESSAGE', payload: savedMessage });
      } else {
        throw new Error('Failed to send message to InstantDB');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      await saveMessageToIndexedDB(message);
      dispatch({ type: 'ADD_MESSAGE', payload: message });
    }
  };

  return (
    <MessagesContext.Provider value={{ messages, fetchMessages, sendMessage }}>
      {children}
    </MessagesContext.Provider>
  );
};

export default MessagesContext;
