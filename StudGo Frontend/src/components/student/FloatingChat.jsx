import React, { useState, useEffect, useRef } from 'react';
import { FaComment, FaTimes, FaPaperPlane, FaTrash } from 'react-icons/fa';
import { chatAxiosInstance } from '../../lib/axios';
import ReactMarkdown from 'react-markdown';
import './FloatingChat.css';

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef(null);
  const messageCounter = useRef(0);
  const currentStreamingMessage = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchChatHistory();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateMessageId = () => {
    messageCounter.current += 1;
    return `${Date.now()}-${messageCounter.current}`;
  };

  const fetchChatHistory = async () => {
    try {
      setIsLoading(true);
      const response = await chatAxiosInstance().get('/conversations');
      console.log('Chat history response:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        const formattedMessages = response.data
          .map(conversation => {
            const messages = [];
            
            if (conversation.last_message) {
              messages.push({
                id: generateMessageId(),
                content: conversation.last_message,
                timestamp: conversation.timestamp,
                isUser: true
              });
            }
            
            if (conversation.last_response) {
              messages.push({
                id: generateMessageId(),
                content: conversation.last_response,
                timestamp: conversation.timestamp,
                isUser: false
              });
            }
            
            return messages;
          })
          .flat();

        console.log('Formatted messages:', formattedMessages);
        setMessages(formattedMessages);
      } else {
        console.warn('Invalid chat history response format:', response.data);
        setMessages([
          {
            id: generateMessageId(),
            content: "Hello! How can I help you today?",
            timestamp: new Date().toISOString(),
            isUser: false
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
      setMessages([
        {
          id: generateMessageId(),
          content: "Hello! How can I help you today?",
          timestamp: new Date().toISOString(),
          isUser: false
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: generateMessageId(),
      content: newMessage,
      timestamp: new Date().toISOString(),
      isUser: true
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);
    setIsStreaming(true);

    try {
      const response = await chatAxiosInstance().post('/chat', {
        message: newMessage
      });

      // Create initial bot message
      const botMessage = {
        id: generateMessageId(),
        content: '',
        timestamp: new Date().toISOString(),
        isUser: false
      };

      setMessages(prev => [...prev, botMessage]);
      currentStreamingMessage.current = botMessage;

      // Simulate streaming by adding characters one by one
      const responseText = response.data.response;
      const words = responseText.split(' ');
      let currentText = '';

      for (const word of words) {
        await new Promise(resolve => setTimeout(resolve, 50)); // 50ms delay between words
        currentText += (currentText ? ' ' : '') + word;
        currentStreamingMessage.current.content = currentText;
        setMessages(prev => [...prev]);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const botMessage = {
        id: generateMessageId(),
        content: "I apologize, but I'm having trouble processing your request right now. Please try again later.",
        timestamp: new Date().toISOString(),
        isUser: false
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      currentStreamingMessage.current = null;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = async () => {
    try {
      setIsLoading(true);
      await chatAxiosInstance().delete('/chat');
      setMessages([]);
    } catch (error) {
      console.error('Error clearing chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="floating-chat-container">
      {!isOpen && (
        <button className="floating-button" onClick={() => setIsOpen(true)}>
          <FaComment />
        </button>
      )}

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>Chat Assistant</h3>
            <div className="header-buttons">
              <button 
                className="clear-button" 
                onClick={handleClearChat}
                disabled={isLoading || isStreaming}
              >
                <FaTrash />
              </button>
              <button className="close-button" onClick={() => setIsOpen(false)}>
                <FaTimes />
              </button>
            </div>
          </div>

          <div className="messages-container">
            {messages.length > 0 ? (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}
                >
                  <div className="message-content">
                    {message.isUser ? (
                      <p>{message.content}</p>
                    ) : (
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    )}
                    <span className="timestamp">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-messages">
                No messages yet. Start a conversation!
              </div>
            )}
            {isStreaming && (
              <div className="loading-message">
                Assistant is typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="input-container">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading || isStreaming}
            />
            <button
              className="send-button"
              onClick={handleSendMessage}
              disabled={isLoading || isStreaming || !newMessage.trim()}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingChat; 