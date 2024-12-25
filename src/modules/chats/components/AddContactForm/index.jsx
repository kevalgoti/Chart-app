import React, { useContext } from 'react';
import ContactsContext from '../../../../contexts/ContactsContext';
import { openDB } from 'idb';
import Input from '../../../../components/Input';
import Button from '../../../../components/Button';

const dbPromise = openDB('whatapp', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('contacts')) {
      db.createObjectStore('contacts', { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains('messages')) {
      db.createObjectStore('messages', { keyPath: 'id' });
    }
  },
});

const AddContactForm = () => {
  const { dispatch } = useContext(ContactsContext);

  const handleAddContact = async (e) => {
    e.preventDefault();

    const contact = {
      id: Date.now().toString(),
      name: e.target.name.value,
      phone: e.target.phone.value,
      lastMessage: '',
    };

    const db = await dbPromise;
    const transaction = db.transaction('contacts', 'readwrite');
    const store = transaction.objectStore('contacts');
    await store.put(contact);

    dispatch({ type: 'ADD_CONTACT', payload: contact });

    e.target.reset();
  };

  return (
    <form onSubmit={handleAddContact} className="space-y-2 absolute bottom-0 w-100 p-4">
      <Input
        name="name"
        placeholder="Name"
        required
        className="w-full p-2 border rounded focus:outline-none"
      />
      <Input
        name="phone"
        placeholder="Phone"
        required
        className="w-full p-2 border rounded focus:outline-none"
      />
      <Button
        type="submit"
        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
      >
        Add Contact
      </Button>
    </form>
  );
};

export default AddContactForm;
