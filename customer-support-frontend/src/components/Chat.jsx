import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Chat = ({ customerId }) => {
  const { authToken } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [ws, setWs] = useState(null);

  // Fetch older messages
  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch(`http://localhost:8000/api/messages/?customer_id=${customerId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    };
    fetchMessages();
  }, [authToken, customerId]);

  // Setup WebSocket for chat
  useEffect(() => {
    const socket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${customerId}/`);
    setWs(socket);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    return () => {
      socket.close();
    };
  }, [customerId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
  
    // Send via API
    const response = await fetch('http://localhost:8000/api/messages/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        customer_id: customerId,
        content: content,
      }),
    });
    if (response.ok) {
      const newMessage = await response.json();
      // Update messages state locally
      setMessages((prev) => [...prev, newMessage]);
      setContent('');
    }
  };
  

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Chat with Customer {customerId}</h2>
      <div className="border p-4 h-64 overflow-y-scroll mb-4 bg-gray-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`mb-2 ${msg.sender_type === 'agent' ? 'text-right' : 'text-left'}`}>
            <p className="inline-block p-2 rounded bg-blue-200">{msg.content}</p>
            <small className="block text-xs text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="flex">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-grow border p-2 rounded-l"
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
