// src/components/chatbot/ChatInterface.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { auth } from '../../services/firebase';
import { 
  createChatSession, 
  addChatMessage, 
  getChatHistory,
  getChatSession,
  endChatSession
} from '../../services/chatService';
import ChatMessage from './ChatMessage';
import SymptomsInput from './SymptomsInput';
import '../../styles/chatbot.css';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [error, setError] = useState('');
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();
  const { sessionId } = useParams();
  
  // Load chat session and history
  useEffect(() => {
    const loadChatData = async () => {
      try {
        setIsLoading(true);
        
        // If sessionId is provided, load existing session
        if (sessionId) {
          const session = await getChatSession(sessionId);
          setSessionData(session);
          
          // Load chat history
          const history = await getChatHistory(sessionId);
          setMessages(history);
        } else {
          // Create a new chat session
          const currentUser = auth.currentUser;
          if (!currentUser) {
            navigate('/login');
            return;
          }
          
          const newSession = await createChatSession(currentUser.uid);
          setSessionData({ id: newSession.id, userId: currentUser.uid });
          
          // Add welcome message
          const welcomeMsg = {
            id: 'welcome',
            content: 'Hello! I\'m your health assistant. Please describe your symptoms or health concerns.',
            isUser: false,
            timestamp: new Date()
          };
          
          setMessages([welcomeMsg]);
          
          // Save welcome message to database
          await addChatMessage(newSession.id, welcomeMsg.content, false);
          
          // Update URL to include session ID without reloading
          navigate(`/chat/${newSession.id}`, { replace: true });
        }
      } catch (err) {
        console.error('Error loading chat data:', err);
        setError('Failed to load chat. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadChatData();
  }, [sessionId, navigate]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!input.trim() || !sessionData) return;
    
    try {
      // Add message to UI immediately
      const newMessage = {
        id: `temp-${Date.now()}`,
        content: input,
        isUser: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInput('');
      
      // Show typing indicator
      setMessages(prev => [
        ...prev, 
        { id: 'typing', content: '...', isUser: false, isTyping: true, timestamp: new Date() }
      ]);
      
      // Save message to database
      await addChatMessage(sessionData.id, input, true);
      
      // Get updated messages
      const updatedHistory = await getChatHistory(sessionData.id);
      
      // Remove typing indicator and update with actual response
      setMessages(updatedHistory);
      
      // Get updated session data
      const updatedSession = await getChatSession(sessionData.id);
      setSessionData(updatedSession);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
      
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => !msg.isTyping));
    }
  };
  
  // Handle ending the chat session
  const handleEndChat = async () => {
    if (!sessionData) return;
    
    try {
      await endChatSession(sessionData.id);
      
      // Add system message about ending the chat
      const endMessage = {
        id: `system-${Date.now()}`,
        content: 'Chat session ended. You can start a new chat from the dashboard.',
        isUser: false,
        isSystem: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, endMessage]);
      
      // Update session data
      const updatedSession = await getChatSession(sessionData.id);
      setSessionData(updatedSession);
    } catch (err) {
      console.error('Error ending chat:', err);
      setError('Failed to end chat session. Please try again.');
    }
  };
  
  // Start a new chat
  const handleNewChat = () => {
    navigate('/chat');
  };
  
  // Display loading state
  if (isLoading) {
    return (
      <div className="chat-loading">
        <div className="spinner"></div>
        <p>Loading chat...</p>
      </div>
    );
  }
  
  return (
    <div className="chat-container">
      {error && <div className="chat-error">{error}</div>}
      
      <div className="chat-header">
        <h2>Health Assistant</h2>
        <div className="chat-actions">
          <button 
            className="new-chat-btn"
            onClick={handleNewChat}
            disabled={!sessionData || sessionData.status === 'active'}
          >
            New Chat
          </button>
          <button 
            className="end-chat-btn"
            onClick={handleEndChat}
            disabled={!sessionData || sessionData.status === 'completed'}
          >
            End Chat
          </button>
        </div>
      </div>
      
      <div className="chat-messages" ref={chatContainerRef}>
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {sessionData && sessionData.status !== 'completed' ? (
        <form className="chat-input-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your symptoms..."
            disabled={!sessionData || sessionData.status === 'completed'}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || !sessionData || sessionData.status === 'completed'}
          >
            Send
          </button>
        </form>
      ) : (
        <div className="chat-ended-message">
          This chat session has ended. Start a new chat to continue.
        </div>
      )}
      
      {sessionData && sessionData.symptoms && sessionData.symptoms.length > 0 && (
        <SymptomsInput 
          sessionId={sessionData.id}
          detectedSymptoms={sessionData.symptoms}
          detectedConditions={sessionData.detectedConditions || []}
          suggestions={sessionData.suggestions || {}}
        />
      )}
    </div>
  );
};

export default ChatInterface;