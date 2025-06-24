import React, { useState, useEffect, useRef } from 'react';
import { FaCommentDots, FaTimes, FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';

const ChatGPTChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are a helpful assistant.' }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:11434/api/chat', {
        model: 'llama3',
        messages: [...messages, userMessage],
        stream: false
      });

      const aiMessage = response.data.message;
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, 
        { role: 'assistant', content: 'Sorry, I encountered an error.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      <button
        className="group bg-[#00192F] text-gray-300 p-3 rounded-full shadow-lg border-gray-400 border-2 transition-transform duration-300 hover:bg-gray-400 hover:scale-110"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <FaTimes size={20} className="group-hover:text-[#00192F]" />
        ) : (
          <FaCommentDots size={20} className="group-hover:text-[#00192F]" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-16 right-4 w-80 bg-gray-200 shadow-lg rounded-lg overflow-hidden">
          <div className="bg-[#00192F] text-gray-200 p-3 text-center font-semibold font-monst text-sm">
            We're here to help you
          </div>

          <div className="h-60 font-lato overflow-y-auto p-2 text-md">
            {messages
              .filter(msg => msg.role !== 'system')
              .map((msg, index) => (
                <div 
                  key={index} 
                  className={`mb-1 ${msg.role === "user" ? "text-right" : "text-left"}`}
                >
                  <span
                    className={`inline-block p-2 rounded-md text-sm ${
                      msg.role === "user" 
                        ? "bg-[#00192F] text-gray-200 rounded-xl" 
                        : "bg-gray-300 text-[#00192F] rounded-xl"
                    }`}
                  >
                    {msg.content}
                  </span>
                </div>
              ))}
            {loading && <p className="text-gray-500 text-xs text-center">Replying...</p>}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center border-t p-2">
            <input
              type="text"
              className="flex-1 p-2 border-2 border-gray-300 rounded-md focus:outline-none font-monst text-black text-sm"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
            />
            <button
              className="group bg-[#00192F] text-gray-300 p-3 rounded-md hover:bg-gray-300 transition-all duration-300"
              onClick={sendMessage}
              disabled={loading}
            >
              <FaPaperPlane size={15} className="group-hover:text-[#00192F]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatGPTChat;
