// src/components/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../services/firebase';
import { getUserProfile } from '../../services/authService';
import { getUserChatSessions } from '../../services/chatService';
import ChatHistory from './ChatHistory';
import ConditionRecords from './ConditionRecords';
import AdviceLog from './AdviceLog';
import '../../styles/dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [chatSessions, setChatSessions] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  
  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        
        const currentUser = auth.currentUser;
        if (!currentUser) {
          navigate('/login');
          return;
        }
        
        setUser(currentUser);
        
        // Load user profile
        const userProfile = await getUserProfile(currentUser.uid);
        setProfile(userProfile);
        
        // Load chat sessions
        const sessions = await getUserChatSessions(currentUser.uid);
        setChatSessions(sessions);
      } catch (err) {
        console.error('Error loading user data:', err);
        setError('Failed to load user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [navigate]);
  
  // Start a new chat
  const handleStartChat = () => {
    navigate('/chat');
  };
  
  // Display loading state
  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }
  
  return (
    <div className="dashboard-container">
      {error && <div className="dashboard-error">{error}</div>}
      
      <div className="dashboard-header">
        <div className="user-welcome">
          <h2>Welcome, {profile?.firstName || user?.displayName || 'User'}</h2>
          <p>Here's an overview of your health assistant interactions</p>
        </div>
        
        <div className="dashboard-actions">
          <button className="primary-button" onClick={handleStartChat}>
            Start New Consultation
          </button>
          <Link to="/profile" className="secondary-button">
            Manage Profile
          </Link>
        </div>
      </div>
      
      <div className="dashboard-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Chat History
        </button>
        <button 
          className={`tab ${activeTab === 'conditions' ? 'active' : ''}`}
          onClick={() => setActiveTab('conditions')}
        >
          Health Conditions
        </button>
        <button 
          className={`tab ${activeTab === 'advice' ? 'active' : ''}`}
          onClick={() => setActiveTab('advice')}
        >
          Health Advice
        </button>
      </div>
      
      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="dashboard-overview">
            <div className="stat-cards">
              <div className="stat-card">
                <h3>Consultations</h3>
                <div className="stat-value">{chatSessions.length}</div>
                <p>Total chat sessions</p>
              </div>
              
              <div className="stat-card">
                <h3>Recent Activity</h3>
                <div className="stat-value">
                  {chatSessions.length > 0 
                    ? new Date(chatSessions[0].lastUpdatedAt).toLocaleDateString() 
                    : 'No activity'}
                </div>
                <p>Last consultation</p>
              </div>
              
              <div className="stat-card">
                <h3>Health Status</h3>
                <div className="stat-value status-indicator">
                  {getHealthStatus(chatSessions)}
                </div>
                <p>Based on recent interactions</p>
              </div>
            </div>
            
            <div className="recent-consultations">
              <h3>Recent Consultations</h3>
              {chatSessions.length > 0 ? (
                <div className="consultations-list">
                  {chatSessions.slice(0, 3).map(session => (
                    <div key={session.id} className="consultation-item">
                      <div className="consultation-date">
                        {formatDate(session.startedAt)}
                      </div>
                      <div className="consultation-details">
                        <div className="consultation-symptoms">
                          {session.symptoms && session.symptoms.length > 0 
                            ? session.symptoms.slice(0, 3).join(', ') + (session.symptoms.length > 3 ? '...' : '')
                            : 'No symptoms recorded'}
                        </div>
                        <div className="consultation-conditions">
                          {session.detectedConditions && session.detectedConditions.length > 0
                            ? session.detectedConditions.slice(0, 2).map(c => c.name).join(', ') + 
                              (session.detectedConditions.length > 2 ? '...' : '')
                            : 'No conditions detected'}
                        </div>
                      </div>
                      <Link to={`/chat/${session.id}`} className="view-consultation">
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-consultations">
                  <p>You haven't had any consultations yet.</p>
                  <button onClick={handleStartChat} className="start-consultation-btn">
                    Start Your First Consultation
                  </button>
                </div>
              )}
            </div>
            
            <div className="health-insights">
              <h3>Health Insights</h3>
              {chatSessions.length > 0 ? (
                <div className="insights-content">
                  {getHealthInsights(chatSessions).map((insight, index) => (
                    <div key={index} className="insight-item">
                      <div className="insight-icon">{insight.icon}</div>
                      <div className="insight-text">{insight.text}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Complete your first consultation to receive health insights.</p>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'history' && (
          <ChatHistory chatSessions={chatSessions} />
        )}
        
        {activeTab === 'conditions' && (
          <ConditionRecords chatSessions={chatSessions} />
        )}
        
        {activeTab === 'advice' && (
          <AdviceLog chatSessions={chatSessions} />
        )}
      </div>
    </div>
  );
};

// Helper function to format date
const formatDate = (date) => {
  if (!date) return 'Unknown date';
  
  const d = new Date(date);
  return d.toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Helper function to determine health status based on sessions
const getHealthStatus = (sessions) => {
  if (!sessions || sessions.length === 0) {
    return 'No Data';
  }
  
  // Check if any recent session (last 7 days) has high urgency conditions
  const recentSessions = sessions.filter(session => {
    const sessionDate = new Date(session.lastUpdatedAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return sessionDate >= weekAgo;
  });
  
  if (recentSessions.length === 0) {
    return 'No Recent Data';
  }
  
  // Check for high urgency conditions
  const hasHighUrgency = recentSessions.some(session => {
    return session.suggestions && session.suggestions.alertLevel === 'high';
  });
  
  if (hasHighUrgency) {
    return 'Needs Attention';
  }
  
  // Check for medium urgency conditions
  const hasMediumUrgency = recentSessions.some(session => {
    return session.suggestions && session.suggestions.alertLevel === 'medium';
  });
  
  if (hasMediumUrgency) {
    return 'Monitor';
  }
  
  // Default to Good
  return 'Good';
};

// Helper function to generate health insights
const getHealthInsights = (sessions) => {
  if (!sessions || sessions.length === 0) {
    return [];
  }
  
  const insights = [];
  
  // Get most recent session
  const recentSession = sessions[0];
  
  // Add suggestion from most recent session
  if (recentSession.suggestions && recentSession.suggestions.homeCare && recentSession.suggestions.homeCare.length > 0) {
    insights.push({
      icon: '💡',
      text: recentSession.suggestions.homeCare[0]
    });
  }
  
  // Add preventive tip
  if (recentSession.suggestions && recentSession.suggestions.preventiveTips && recentSession.suggestions.preventiveTips.length > 0) {
    insights.push({
      icon: '🛡️',
      text: recentSession.suggestions.preventiveTips[0]
    });
  }
  
  // Add consultation reminder if needed
  if (recentSession.suggestions && recentSession.suggestions.alertLevel === 'medium') {
    insights.push({
      icon: '🩺',
      text: 'Consider scheduling a check-up with your healthcare provider'
    });
  } else if (recentSession.suggestions && recentSession.suggestions.alertLevel === 'high') {
    insights.push({
      icon: '⚠️',
      text: 'Please consult with a healthcare provider soon'
    });
  }
  
  // Add general health tip if we don't have enough insights
  if (insights.length < 2) {
    insights.push({
      icon: '💧',
      text: 'Remember to stay hydrated throughout the day'
    });
  }
  
  if (insights.length < 3) {
    insights.push({
      icon: '🧘',
      text: 'Regular exercise and stress management can improve overall health'
    });
  }
  
  return insights;
};

export default Dashboard;