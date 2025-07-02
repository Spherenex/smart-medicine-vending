// src/components/dashboard/ChatHistory.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/dashboard.css';

const ChatHistory = ({ chatSessions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  
  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };
  
  // Filter and sort sessions
  const filteredSessions = chatSessions
    .filter(session => {
      // If no search term, include all sessions
      if (!searchTerm.trim()) return true;
      
      // Search by symptoms
      const hasMatchingSymptoms = session.symptoms && 
        session.symptoms.some(symptom => 
          symptom.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      // Search by conditions
      const hasMatchingConditions = session.detectedConditions && 
        session.detectedConditions.some(condition => 
          condition.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
      return hasMatchingSymptoms || hasMatchingConditions;
    })
    .sort((a, b) => {
      // Sort by date
      if (sortBy === 'date') {
        const dateA = new Date(a.startedAt);
        const dateB = new Date(b.startedAt);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      // Sort by symptoms count
      if (sortBy === 'symptoms') {
        const countA = a.symptoms ? a.symptoms.length : 0;
        const countB = b.symptoms ? b.symptoms.length : 0;
        return sortOrder === 'asc' ? countA - countB : countB - countA;
      }
      
      // Sort by urgency level
      if (sortBy === 'urgency') {
        const urgencyLevels = { high: 3, medium: 2, low: 1, undefined: 0 };
        const levelA = a.suggestions ? urgencyLevels[a.suggestions.alertLevel] || 0 : 0;
        const levelB = b.suggestions ? urgencyLevels[b.suggestions.alertLevel] || 0 : 0;
        return sortOrder === 'asc' ? levelA - levelB : levelB - levelA;
      }
      
      return 0;
    });
  
  // Format date
  const formatDate = (date) => {
    if (!date) return 'Unknown date';
    
    const d = new Date(date);
    return d.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="chat-history-container">
      <div className="history-header">
        <h2>Chat History</h2>
        <p>Review all your previous health consultations</p>
      </div>
      
      <div className="history-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by symptoms or conditions..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="sort-options">
          <select value={sortBy} onChange={handleSortChange}>
            <option value="date">Sort by Date</option>
            <option value="symptoms">Sort by Symptoms Count</option>
            <option value="urgency">Sort by Urgency Level</option>
          </select>
          
          <button 
            className="sort-order-btn" 
            onClick={toggleSortOrder}
            title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>
      
      {filteredSessions.length > 0 ? (
        <div className="history-list">
          <div className="history-list-header">
            <div className="history-column date-column">Date & Time</div>
            <div className="history-column symptoms-column">Symptoms</div>
            <div className="history-column conditions-column">Possible Conditions</div>
            <div className="history-column urgency-column">Urgency</div>
            <div className="history-column actions-column">Actions</div>
          </div>
          
          {filteredSessions.map(session => (
            <div key={session.id} className="history-item">
              <div className="history-column date-column">
                {formatDate(session.startedAt)}
              </div>
              
              <div className="history-column symptoms-column">
                {session.symptoms && session.symptoms.length > 0 ? (
                  <div className="symptoms-list">
                    {session.symptoms.slice(0, 3).map((symptom, index) => (
                      <span key={index} className="symptom-tag">
                        {symptom}
                      </span>
                    ))}
                    {session.symptoms.length > 3 && (
                      <span className="more-tag">
                        +{session.symptoms.length - 3} more
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="no-data">No symptoms recorded</span>
                )}
              </div>
              
              <div className="history-column conditions-column">
                {session.detectedConditions && session.detectedConditions.length > 0 ? (
                  <div className="conditions-list">
                    {session.detectedConditions.slice(0, 2).map((condition, index) => (
                      <span key={index} className="condition-tag">
                        {condition.name}
                      </span>
                    ))}
                    {session.detectedConditions.length > 2 && (
                      <span className="more-tag">
                        +{session.detectedConditions.length - 2} more
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="no-data">No conditions detected</span>
                )}
              </div>
              
              <div className="history-column urgency-column">
                {session.suggestions && session.suggestions.alertLevel ? (
                  <span className={`urgency-level ${session.suggestions.alertLevel}`}>
                    {session.suggestions.alertLevel.toUpperCase()}
                  </span>
                ) : (
                  <span className="no-data">N/A</span>
                )}
              </div>
              
              <div className="history-column actions-column">
                <Link to={`/chat/${session.id}`} className="view-chat-btn">
                  View Chat
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-history">
          <p>
            {searchTerm.trim() 
              ? 'No chat sessions match your search criteria.' 
              : 'You haven\'t had any consultations yet.'}
          </p>
          
          {!searchTerm.trim() && (
            <Link to="/chat" className="start-chat-btn">
              Start Your First Consultation
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatHistory;