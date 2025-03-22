import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { config } from '../config';
import { getMessages, sendMessage } from '../services/api';

const Chat = () => {
  const { authToken } = useContext(AuthContext);
  const { customerId } = useParams();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getMessages(authToken, customerId);
        setMessages(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, [authToken, customerId]);

  useEffect(() => {
    const socket = new WebSocket(`${config.ws.baseUrl}chat/${customerId}/`);
    setWs(socket);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    return () => socket.close();
  }, [customerId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      const newMessage = await sendMessage(authToken, customerId, content);
      setMessages((prev) => [...prev, newMessage]);
      setContent('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Chat with Customer {customerId}</h2>
      <div className="bg-white/30 backdrop-blur-md p-4 h-64 overflow-y-scroll mb-4 border border-white/50 rounded">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 ${msg.sender_type === 'agent' ? 'text-right' : 'text-left'}`}
          >
            <p className="inline-block p-2 rounded bg-blue-200">{msg.content}</p>
            <small className="block text-xs text-gray-500">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </small>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="flex">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-grow p-2 rounded-l bg-white/30 backdrop-blur-sm border border-white/50"
          placeholder="Type your message..."
        />
        <button type="submit" className="bg-blue-500 text-white px-4 rounded-r">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;