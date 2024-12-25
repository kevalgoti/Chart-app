'use client';
import React, { useState } from 'react';
import ContactList from './components/ContactList';
import ChatWindow from './components/ChatWindow';
import AddContactForm from './components/AddContactForm';
import Button from '../../components/Button';

const Chats = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="flex h-screen bg-gray-200">
        <div className="w-1/4 bg-gray-100 flex flex-col border-r relative">

          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b ">
            <div className="h-10 w-10 bg-gray-400 rounded-full"></div>
          </div>

          {isModalOpen && (
            <AddContactForm onClose={() => setModalOpen(false)} />
          )}
          <Button
            className="absolute bottom-4 right-4 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600"
            onClick={() => setModalOpen(prevState => !prevState)}
          >
            +
          </Button>
          <ContactList onSelectContact={setSelectedContact} />

        </div>

        <div className="flex-1 flex flex-col">
          {selectedContact ? (
            <ChatWindow selectedContact={selectedContact} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a contact to start chatting
            </div>
          )}
        </div>


      </div>
    </>
  );
};

export default Chats;
