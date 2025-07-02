// src/components/chatbot/ChatMessage.jsx
import React from 'react';
import '../../styles/chatbot.css';

const ChatMessage = ({ message }) => {
  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = timestamp instanceof Date ? timestamp : timestamp.toDate();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Handle typing indicator
  if (message.isTyping) {
    return (
      <div className="message bot-message">
        <div className="message-content">
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    );
  }
  
  // Handle system messages
  if (message.isSystem) {
    return (
      <div className="message system-message">
        <div className="message-content">
          {message.content}
        </div>
        <div className="message-time">{formatTime(message.timestamp)}</div>
      </div>
    );
  }
  
  // Handle regular user or bot messages
  return (
    <div className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}>
      <div className="message-avatar">
        {message.isUser ? (
          <div className="user-avatar">U</div>
        ) : (
          <div className="bot-avatar">AI</div>
        )}
      </div>
      <div className="message-content">
        {message.content}
        <div className="message-time">{formatTime(message.timestamp)}</div>
      </div>
    </div>
  );
};

export default ChatMessage;