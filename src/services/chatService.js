// src/services/chatService.js

import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { analyzeSymptoms } from './symptomService';

// Save a message to the database
export const saveMessage = async (text, sender, suggestions = [], conditions = []) => {
  try {
    if (!auth.currentUser) throw new Error("User not authenticated");
    
    return await addDoc(collection(db, 'chatMessages'), {
      text,
      sender,
      userId: auth.currentUser.uid,
      timestamp: serverTimestamp(),
      suggestions,
      detectedConditions: conditions
    });
  } catch (error) {
    console.error("Error saving message:", error);
    throw error;
  }
};

// Get chat history for the current user
export const getChatHistory = async () => {
  try {
    if (!auth.currentUser) throw new Error("User not authenticated");
    
    const chatQuery = query(
      collection(db, 'chatMessages'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('timestamp', 'asc')
    );
    
    const querySnapshot = await getDocs(chatQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date()
    }));
  } catch (error) {
    console.error("Error fetching chat history:", error);
    throw error;
  }
};

// Process a user message and get bot response
export const processMessage = async (userInput, previousMessages) => {
  try {
    // Save user message to database
    await saveMessage(userInput, 'user');
    
    // Analyze symptoms and generate response
    const response = await analyzeSymptoms(userInput, previousMessages);
    
    // Save bot response to database
    await saveMessage(
      response.message, 
      'bot', 
      response.suggestions || [], 
      response.conditions || []
    );
    
    return response;
  } catch (error) {
    console.error("Error processing message:", error);
    throw error;
  }
};