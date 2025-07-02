// src/components/dashboard/ConditionRecords.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/dashboard.css';

const ConditionRecords = ({ chatSessions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredConditions, setFilteredConditions] = useState([]);
  const [selectedCondition, setSelectedCondition] = useState(null);
  
  // Process all detected conditions from sessions
  useEffect(() => {
    // Extract all unique conditions with their occurrences
    const conditionsMap = new Map();
    
    chatSessions.forEach(session => {
      if (session.detectedConditions && session.detectedConditions.length > 0) {
        session.detectedConditions.forEach(condition => {
          if (conditionsMap.has(condition.id)) {
            const existingCondition = conditionsMap.get(condition.id);
            existingCondition.occurrences.push({
              sessionId: session.id,
              date: session.startedAt,
              matchPercentage: condition.matchPercentage,
              symptoms: session.symptoms || []
            });
            
            // Update last occurrence if this is more recent
            if (new Date(session.startedAt) > new Date(existingCondition.lastOccurrence)) {
              existingCondition.lastOccurrence = session.startedAt;
            }
          } else {
            conditionsMap.set(condition.id, {
              id: condition.id,
              name: condition.name,
              occurrences: [{
                sessionId: session.id,
                date: session.startedAt,
                matchPercentage: condition.matchPercentage,
                symptoms: session.symptoms || []
              }],
              urgency: condition.urgency,
              lastOccurrence: session.startedAt
            });
          }
        });
      }
    });
    
    // Convert map to array and sort by occurrences count (most frequent first)
    const conditionsArray = Array.from(conditionsMap.values())
      .sort((a, b) => b.occurrences.length - a.occurrences.length);
    
    setFilteredConditions(conditionsArray);
  }, [chatSessions]);
  
  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    
    if (!e.target.value.trim()) {
      // If search is cleared, reset to all conditions
      const conditionsArray = Array.from(
        chatSessions.reduce((map, session) => {
          if (session.detectedConditions && session.detectedConditions.length > 0) {
            session.detectedConditions.forEach(condition => {
              if (map.has(condition.id)) {
                const existingCondition = map.get(condition.id);
                existingCondition.occurrences.push({
                  sessionId: session.id,
                  date: session.startedAt,
                  matchPercentage: condition.matchPercentage,
                  symptoms: session.symptoms || []
                });
                
                if (new Date(session.startedAt) > new Date(existingCondition.lastOccurrence)) {
                  existingCondition.lastOccurrence = session.startedAt;
                }
              } else {
                map.set(condition.id, {
                  id: condition.id,
                  name: condition.name,
                  occurrences: [{
                    sessionId: session.id,
                    date: session.startedAt,
                    matchPercentage: condition.matchPercentage,
                    symptoms: session.symptoms || []
                  }],
                  urgency: condition.urgency,
                  lastOccurrence: session.startedAt
                });
              }
            });
          }
          return map;
        }, new Map())
      ).sort((a, b) => b.occurrences.length - a.occurrences.length);
      
      setFilteredConditions(conditionsArray);
    } else {
      // Filter conditions by name
      const searchLower = e.target.value.toLowerCase();
      
      const conditionsArray = Array.from(
        chatSessions.reduce((map, session) => {
          if (session.detectedConditions && session.detectedConditions.length > 0) {
            session.detectedConditions
              .filter(condition => condition.name.toLowerCase().includes(searchLower))
              .forEach(condition => {
                if (map.has(condition.id)) {
                  const existingCondition = map.get(condition.id);
                  existingCondition.occurrences.push({
                    sessionId: session.id,
                    date: session.startedAt,
                    matchPercentage: condition.matchPercentage,
                    symptoms: session.symptoms || []
                  });
                  
                  if (new Date(session.startedAt) > new Date(existingCondition.lastOccurrence)) {
                    existingCondition.lastOccurrence = session.startedAt;
                  }
                } else {
                  map.set(condition.id, {
                    id: condition.id,
                    name: condition.name,
                    occurrences: [{
                      sessionId: session.id,
                      date: session.startedAt,
                      matchPercentage: condition.matchPercentage,
                      symptoms: session.symptoms || []
                    }],
                    urgency: condition.urgency,
                    lastOccurrence: session.startedAt
                  });
                }
              });
          }
          return map;
        }, new Map())
      ).sort((a, b) => b.occurrences.length - a.occurrences.length);
      
      setFilteredConditions(conditionsArray);
    }
  };
  
  // Handle condition selection
  const handleConditionSelect = (condition) => {
    setSelectedCondition(condition);
  };
  
  // Format date
  const formatDate = (date) => {
    if (!date) return 'Unknown date';
    
    const d = new Date(date);
    return d.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="condition-records-container">
      <div className="conditions-header">
        <h2>Health Conditions</h2>
        <p>Review possible health conditions detected from your consultations</p>
      </div>
      
      <div className="conditions-search">
        <input
          type="text"
          placeholder="Search conditions..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      
      <div className="conditions-content">
        <div className="conditions-list">
          {filteredConditions.length > 0 ? (
            filteredConditions.map(condition => (
              <div 
                key={condition.id} 
                className={`condition-card ${selectedCondition?.id === condition.id ? 'selected' : ''}`}
                onClick={() => handleConditionSelect(condition)}
              >
                <div className="condition-card-header">
                  <h3>{condition.name}</h3>
                  <span className={`urgency-tag ${condition.urgency}`}>
                    {condition.urgency}
                  </span>
                </div>
                
                <div className="condition-stats">
                  <div className="condition-stat">
                    <span className="stat-label">Occurrences</span>
                    <span className="stat-value">{condition.occurrences.length}</span>
                  </div>
                  
                  <div className="condition-stat">
                    <span className="stat-label">Last Detected</span>
                    <span className="stat-value">{formatDate(condition.lastOccurrence)}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-conditions">
              <p>No conditions match your search criteria.</p>
            </div>
          )}
        </div>
        
        <div className="condition-details">
          {selectedCondition ? (
            <div className="condition-detail-content">
              <div className="detail-header">
                <h3>{selectedCondition.name}</h3>
                <span className={`urgency-tag ${selectedCondition.urgency}`}>
                  {selectedCondition.urgency.toUpperCase()} Urgency
                </span>
              </div>
              
              <div className="detail-section">
                <h4>Common Symptoms</h4>
                <div className="common-symptoms">
                  {getCommonSymptoms(selectedCondition).map((symptom, index) => (
                    <span key={index} className="symptom-tag">{symptom}</span>
                  ))}
                </div>
              </div>
              
              <div className="detail-section">
                <h4>History</h4>
                <div className="occurrence-history">
                  {selectedCondition.occurrences
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((occurrence, index) => (
                      <div key={index} className="occurrence-item">
                        <div className="occurrence-date">
                          {formatDate(occurrence.date)}
                        </div>
                        <div className="occurrence-match">
                          Match: {Math.round(occurrence.matchPercentage * 100)}%
                        </div>
                        <div className="occurrence-symptoms">
                          {occurrence.symptoms.map((symptom, sIndex) => (
                            <span key={sIndex} className="symptom-tag small">
                              {symptom}
                            </span>
                          ))}
                        </div>
                        <Link 
                          to={`/chat/${occurrence.sessionId}`}
                          className="view-chat-link"
                        >
                          View Chat
                        </Link>
                      </div>
                    ))}
                </div>
              </div>
              
              <div className="detail-section">
                <h4>Disclaimer</h4>
                <p className="disclaimer-text">
                  This information is based on your chat interactions and is not a medical diagnosis. 
                  Always consult with a healthcare professional for proper medical advice.
                </p>
              </div>
            </div>
          ) : (
            <div className="no-condition-selected">
              <p>Select a condition to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to extract common symptoms from condition occurrences
const getCommonSymptoms = (condition) => {
  // Count symptom occurrences
  const symptomCounts = condition.occurrences.reduce((counts, occurrence) => {
    occurrence.symptoms.forEach(symptom => {
      counts[symptom] = (counts[symptom] || 0) + 1;
    });
    return counts;
  }, {});
  
  // Convert to array and sort by count
  const sortedSymptoms = Object.entries(symptomCounts)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
  
  // Return top symptoms (up to 10)
  return sortedSymptoms.slice(0, 10);
};

export default ConditionRecords;