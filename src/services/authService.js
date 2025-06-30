// src/services/authService.js

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

// Register a new user
export const registerUser = async (email, password, userData) => {
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Set display name
    await updateProfile(userCredential.user, {
      displayName: userData.name
    });
    
    // Store additional user data in Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      name: userData.name,
      age: userData.age,
      gender: userData.gender,
      phone: userData.phone,
      email: userData.email,
      medicalHistory: userData.medicalHistory,
      createdAt: new Date()
    });
    
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Get user profile data
export const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      throw new Error("User profile not found");
    }
  } catch (error) {
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    await updateDoc(doc(db, "users", userId), profileData);
  } catch (error) {
    throw error;
  }
};

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
};