// src/components/chatbot/ChatMessage.jsx

import React from 'react';
import './ChatStyles.css';

const ChatMessage = ({ message }) => {
  // Format timestamp if it exists
  const formattedTime = message.timestamp ? 
    message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '';
  
  // Function to highlight medication names and information
  const formatMedicationText = (text) => {
    if (!text) return '';
    
    // Split the text by lines to process paragraph by paragraph
    const paragraphs = text.split('\n').map(paragraph => {
      // Check if this paragraph contains medication information
      if (/\b(medication|tablet|capsule|pill|drug|dose|dosage|mg|ml|treatment|prescri)\b/i.test(paragraph)) {
        return `<p class="medication-highlight">${paragraph}</p>`;
      }
      return `<p>${paragraph}</p>`;
    });
    
    return paragraphs.join('');
  };
  
  return (
    <div className={`message ${message.sender}-message`}>
      <div className="message-content">
        {message.sender === 'bot' ? (
          <div dangerouslySetInnerHTML={{ 
            __html: formatMedicationText(message.text) 
          }} />
        ) : (
          message.text
        )}
      </div>
      
      {message.suggestions && message.suggestions.length > 0 && (
        <div className="message-suggestions">
          <div className="suggestion-chips">
            {message.suggestions.map((suggestion, index) => (
              <button key={index} onClick={() => {
                // Set the input field to this suggestion
                const inputField = document.querySelector('.chatbot-input-form input');
                if (inputField) {
                  inputField.value = suggestion;
                  inputField.focus();
                }
              }}>
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {formattedTime && <div className="message-time">{formattedTime}</div>}
    </div>
  );
};

export default ChatMessage;