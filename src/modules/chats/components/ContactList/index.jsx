import React, { useContext } from 'react';
import ContactsContext from '../../../../contexts/ContactsContext';

const ContactList = ({ onSelectContact }) => {
  const { contacts } = useContext(ContactsContext);

  return (
    <div className="overflow-y-auto">
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className="p-3 flex items-center space-x-3 cursor-pointer hover:bg-gray-200"
          onClick={() => onSelectContact(contact)}
        >
          <div className="h-12 w-12 rounded-full bg-gray-300"></div>
          <div className="flex-1">
            <p className="font-semibold">{contact.name}</p>
            <p className="text-sm text-gray-500 truncate">
              {contact.lastMessage || 'No messages yet'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
