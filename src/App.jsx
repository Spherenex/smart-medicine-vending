// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase';

// Auth components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PasswordReset from './components/auth/PasswordReset';

// Main components
import Dashboard from './components/dashboard/Dashboard';
import ChatInterface from './components/chatbot/ChatInterface';
import UserProfile from './components/profile/UserProfile';
import EditProfile from './components/profile/EditProfile';

// Common components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

// Styles
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <Router>
      <div className="app">
        <Navbar user={user} />
        
        <main className="main-content">
          <Routes>
            {/* Public routes */}
            <Route 
              path="/login" 
              element={user ? <Navigate to="/dashboard" /> : <Login />} 
            />
            <Route 
              path="/register" 
              element={user ? <Navigate to="/dashboard" /> : <Register />} 
            />
            <Route 
              path="/reset-password" 
              element={user ? <Navigate to="/dashboard" /> : <PasswordReset />} 
            />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute user={user}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/chat" 
              element={
                <ProtectedRoute user={user}>
                  <ChatInterface />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/chat/:sessionId" 
              element={
                <ProtectedRoute user={user}>
                  <ChatInterface />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute user={user}>
                  <UserProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile/edit" 
              element={
                <ProtectedRoute user={user}>
                  <EditProfile />
                </ProtectedRoute>
              } 
            />
            
            {/* Default route */}
            <Route 
              path="/" 
              element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
            />
            
            {/* Catch all - redirect to dashboard or login */}
            <Route 
              path="*" 
              element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;