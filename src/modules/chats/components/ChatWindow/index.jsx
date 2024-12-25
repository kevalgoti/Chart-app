'use client';
import React, { useContext, useState, useEffect } from 'react';
import MessagesContext from '../../../../contexts/MessagesContext';
import Input from '../../../../components/Input';
import Button from '../../../../components/Button';

const ChatWindow = ({ selectedContact }) => {
  const { messages, fetchMessages, sendMessage } = useContext(MessagesContext);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (selectedContact) fetchMessages(selectedContact.id);
  }, [selectedContact]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage(selectedContact.id, newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex items-center space-x-3 p-4 bg-gray-50 border-b">
        <div className="h-10 w-10 rounded-full bg-gray-300"></div>
        <div className="flex-1">
          <p className="font-semibold">{selectedContact.name}</p>
          <p className="text-sm text-gray-500">Online</p>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-lg mb-2 max-w-xs ${msg.sender === 'self'
                ? 'bg-green-500 text-white self-end'
                : 'bg-white shadow'
              }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex items-center p-4 bg-gray-50 border-t">
        <Input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
          className="flex-1 p-2 border rounded focus:outline-none"
        />
        <Button
          onClick={handleSendMessage}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatWindow;
