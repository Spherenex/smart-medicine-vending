// src/services/authService.js
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

// Register a new user
export const registerUser = async (email, password, userData) => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with displayName
    await updateProfile(user, {
      displayName: `${userData.firstName} ${userData.lastName}`
    });
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: email,
      age: userData.age || '',
      gender: userData.gender || '',
      phone: userData.phone || '',
      medicalHistory: userData.medicalHistory || [],
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    });
    
    return user;
  } catch (error) {
    throw error;
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update last login timestamp
    await updateDoc(doc(db, 'users', user.uid), {
      lastLogin: new Date().toISOString()
    });
    
    return user;
  } catch (error) {
    throw error;
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    throw error;
  }
};

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    throw error;
  }
};

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error('User profile not found');
    }
  } catch (error) {
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId, userData) => {
  try {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      ...userData,
      updatedAt: new Date().toISOString()
    });
    
    // Update displayName if first or last name changed
    if (userData.firstName || userData.lastName) {
      const userDoc = await getDoc(docRef);
      const userProfile = userDoc.data();
      const displayName = `${userData.firstName || userProfile.firstName} ${userData.lastName || userProfile.lastName}`;
      
      await updateProfile(auth.currentUser, {
        displayName: displayName
      });
    }
    
    return true;
  } catch (error) {
    throw error;
  }
};

// Update user email
export const updateUserEmail = async (newEmail, password) => {
  try {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, password);
    
    // Reauthenticate user before changing email
    await reauthenticateWithCredential(user, credential);
    
    // Update email in authentication
    await updateEmail(user, newEmail);
    
    // Update email in Firestore
    await updateDoc(doc(db, 'users', user.uid), {
      email: newEmail,
      updatedAt: new Date().toISOString()
    });
    
    return true;
  } catch (error) {
    throw error;
  }
};

// Update user password
export const updateUserPassword = async (currentPassword, newPassword) => {
  try {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    
    // Reauthenticate user before changing password
    await reauthenticateWithCredential(user, credential);
    
    // Update password
    await updatePassword(user, newPassword);
    
    return true;
  } catch (error) {
    throw error;
  }
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};