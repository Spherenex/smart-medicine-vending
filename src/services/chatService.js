// src/services/chatService.js
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  doc, 
  getDoc,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { analyzeSymptoms } from '../utils/symptomsAnalyzer';
import { generateSuggestions } from '../utils/suggestionGenerator';

// Create a new chat session
export const createChatSession = async (userId) => {
  try {
    const sessionRef = await addDoc(collection(db, 'chatSessions'), {
      userId,
      startedAt: serverTimestamp(),
      lastUpdatedAt: serverTimestamp(),
      status: 'active',
      symptoms: [],
      detectedConditions: [],
      suggestions: {}
    });
    
    return { id: sessionRef.id };
  } catch (error) {
    throw error;
  }
};

// Add a message to chat
export const addChatMessage = async (sessionId, message, isUser = true) => {
  try {
    const messageRef = await addDoc(collection(db, 'chatMessages'), {
      sessionId,
      content: message,
      isUser,
      timestamp: serverTimestamp()
    });
    
    // Update the last updated timestamp of the session
    const sessionRef = doc(db, 'chatSessions', sessionId);
    await updateDoc(sessionRef, {
      lastUpdatedAt: serverTimestamp()
    });
    
    // If it's a user message, process it for symptoms
    if (isUser) {
      await processUserMessage(sessionId, message);
    }
    
    return { id: messageRef.id };
  } catch (error) {
    throw error;
  }
};

// Process user message for symptoms
const processUserMessage = async (sessionId, message) => {
  try {
    // Get current session
    const sessionRef = doc(db, 'chatSessions', sessionId);
    const sessionSnap = await getDoc(sessionRef);
    
    if (!sessionSnap.exists()) {
      throw new Error('Chat session not found');
    }
    
    const sessionData = sessionSnap.data();
    
    // Extract symptoms from message
    const extractedSymptoms = await analyzeSymptoms(message);
    
    if (extractedSymptoms.length > 0) {
      // Update symptoms array in session
      const updatedSymptoms = [...new Set([...sessionData.symptoms, ...extractedSymptoms])];
      
      // Detect conditions based on symptoms
      const detectedConditions = await detectConditions(updatedSymptoms);
      
      // Generate suggestions based on detected conditions
      const suggestions = await generateSuggestions(detectedConditions);
      
      // Update session with new data
      await updateDoc(sessionRef, {
        symptoms: updatedSymptoms,
        detectedConditions,
        suggestions,
        lastUpdatedAt: serverTimestamp()
      });
      
      // Generate a bot response based on the extracted symptoms
      await generateBotResponse(sessionId, extractedSymptoms, detectedConditions);
    }
  } catch (error) {
    console.error('Error processing user message:', error);
  }
};

// Detect conditions based on symptoms
const detectConditions = async (symptoms) => {
  try {
    // This would typically call a more complex condition matching algorithm
    // For now, we'll use a simplified version from our utils
    const { matchConditions } = await import('../utils/conditionMatcher');
    return await matchConditions(symptoms);
  } catch (error) {
    console.error('Error detecting conditions:', error);
    return [];
  }
};

// Generate a bot response based on symptoms and conditions
const generateBotResponse = async (sessionId, symptoms, conditions) => {
  try {
    let response = '';
    
    // If new symptoms were detected
    if (symptoms.length > 0) {
      if (conditions.length > 0) {
        // If conditions were detected, ask follow-up questions
        response = generateFollowUpQuestions(symptoms, conditions);
      } else {
        // If no conditions yet, ask for more symptoms
        response = `I notice you mentioned ${symptoms.join(', ')}. Can you tell me more about how you're feeling?`;
      }
    } else {
      // Generic response if no symptoms were detected
      response = "I don't quite understand. Could you describe your symptoms more clearly?";
    }
    
    // Add the bot response to the chat
    await addChatMessage(sessionId, response, false);
  } catch (error) {
    console.error('Error generating bot response:', error);
  }
};

// Generate follow-up questions based on symptoms and conditions
const generateFollowUpQuestions = (symptoms, conditions) => {
  // In a real application, this would be more sophisticated
  // and specific to the detected conditions
  const condition = conditions[0]; // Just use the first condition for simplicity
  
  const followUpQuestions = {
    'cold': 'Do you also have a runny nose or sore throat?',
    'flu': 'Have you been experiencing muscle aches or fatigue?',
    'allergy': 'Have you been exposed to any known allergens recently?',
    'headache': 'Is the pain throbbing or constant?',
    'stomachache': 'Have you experienced any nausea or changes in appetite?',
    'default': 'How long have you been experiencing these symptoms?'
  };
  
  return followUpQuestions[condition] || followUpQuestions.default;
};

// Get chat history for a session
export const getChatHistory = async (sessionId) => {
  try {
    const q = query(
      collection(db, 'chatMessages'),
      where('sessionId', '==', sessionId),
      orderBy('timestamp', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const messages = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate() || new Date()
      });
    });
    
    return messages;
  } catch (error) {
    throw error;
  }
};

// Get all chat sessions for a user
export const getUserChatSessions = async (userId) => {
  try {
    const q = query(
      collection(db, 'chatSessions'),
      where('userId', '==', userId),
      orderBy('lastUpdatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const sessions = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      sessions.push({
        id: doc.id,
        ...data,
        startedAt: data.startedAt?.toDate() || new Date(),
        lastUpdatedAt: data.lastUpdatedAt?.toDate() || new Date()
      });
    });
    
    return sessions;
  } catch (error) {
    throw error;
  }
};

// Get details of a specific chat session
export const getChatSession = async (sessionId) => {
  try {
    const sessionRef = doc(db, 'chatSessions', sessionId);
    const sessionSnap = await getDoc(sessionRef);
    
    if (sessionSnap.exists()) {
      const data = sessionSnap.data();
      return {
        id: sessionSnap.id,
        ...data,
        startedAt: data.startedAt?.toDate() || new Date(),
        lastUpdatedAt: data.lastUpdatedAt?.toDate() || new Date()
      };
    } else {
      throw new Error('Chat session not found');
    }
  } catch (error) {
    throw error;
  }
};

// End a chat session
export const endChatSession = async (sessionId) => {
  try {
    const sessionRef = doc(db, 'chatSessions', sessionId);
    await updateDoc(sessionRef, {
      status: 'completed',
      endedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    throw error;
  }
};