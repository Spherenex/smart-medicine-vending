// src/components/dashboard/AdviceLog.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/dashboard.css';

const AdviceLog = ({ chatSessions }) => {
  const [adviceCategories, setAdviceCategories] = useState({
    homeCare: [],
    actionPlan: [],
    preventiveTips: []
  });
  const [activeCategory, setActiveCategory] = useState('homeCare');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Process advice from all chat sessions
  useEffect(() => {
    const homeCareAdvice = new Map();
    const actionPlanAdvice = new Map();
    const preventiveAdvice = new Map();
    
    // Extract unique advice with their occurrences
    chatSessions.forEach(session => {
      if (session.suggestions) {
        // Process home care tips
        if (session.suggestions.homeCare && session.suggestions.homeCare.length > 0) {
          session.suggestions.homeCare.forEach(tip => {
            if (homeCareAdvice.has(tip)) {
              homeCareAdvice.get(tip).occurrences.push({
                sessionId: session.id,
                date: session.lastUpdatedAt,
                conditions: session.detectedConditions || []
              });
            } else {
              homeCareAdvice.set(tip, {
                text: tip,
                occurrences: [{
                  sessionId: session.id,
                  date: session.lastUpdatedAt,
                  conditions: session.detectedConditions || []
                }]
              });
            }
          });
        }
        
        // Process action plans
        if (session.suggestions.actionPlan && session.suggestions.actionPlan.length > 0) {
          session.suggestions.actionPlan.forEach(action => {
            if (actionPlanAdvice.has(action)) {
              actionPlanAdvice.get(action).occurrences.push({
                sessionId: session.id,
                date: session.lastUpdatedAt,
                conditions: session.detectedConditions || []
              });
            } else {
              actionPlanAdvice.set(action, {
                text: action,
                occurrences: [{
                  sessionId: session.id,
                  date: session.lastUpdatedAt,
                  conditions: session.detectedConditions || []
                }]
              });
            }
          });
        }
        
        // Process preventive tips
        if (session.suggestions.preventiveTips && session.suggestions.preventiveTips.length > 0) {
          session.suggestions.preventiveTips.forEach(tip => {
            if (preventiveAdvice.has(tip)) {
              preventiveAdvice.get(tip).occurrences.push({
                sessionId: session.id,
                date: session.lastUpdatedAt,
                conditions: session.detectedConditions || []
              });
            } else {
              preventiveAdvice.set(tip, {
                text: tip,
                occurrences: [{
                  sessionId: session.id,
                  date: session.lastUpdatedAt,
                  conditions: session.detectedConditions || []
                }]
              });
            }
          });
        }
      }
    });
    
    // Convert maps to arrays and sort by occurrences (most frequent first)
    setAdviceCategories({
      homeCare: Array.from(homeCareAdvice.values())
        .sort((a, b) => b.occurrences.length - a.occurrences.length),
      actionPlan: Array.from(actionPlanAdvice.values())
        .sort((a, b) => b.occurrences.length - a.occurrences.length),
      preventiveTips: Array.from(preventiveAdvice.values())
        .sort((a, b) => b.occurrences.length - a.occurrences.length)
    });
  }, [chatSessions]);
  
  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Filter advice by search term
  const getFilteredAdvice = () => {
    if (!searchTerm.trim()) {
      return adviceCategories[activeCategory];
    }
    
    const searchLower = searchTerm.toLowerCase();
    return adviceCategories[activeCategory].filter(advice => 
      advice.text.toLowerCase().includes(searchLower)
    );
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
  
  // Get category label
  const getCategoryLabel = (category) => {
    switch (category) {
      case 'homeCare':
        return 'Home Care Tips';
      case 'actionPlan':
        return 'Action Plans';
      case 'preventiveTips':
        return 'Preventive Tips';
      default:
        return '';
    }
  };
  
  // Get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'homeCare':
        return '🏠';
      case 'actionPlan':
        return '📋';
      case 'preventiveTips':
        return '🛡️';
      default:
        return '';
    }
  };
  
  const filteredAdvice = getFilteredAdvice();
  
  return (
    <div className="advice-log-container">
      <div className="advice-header">
        <h2>Health Advice Log</h2>
        <p>Review personalized health suggestions from your consultations</p>
      </div>
      
      <div className="advice-filters">
        <div className="category-tabs">
          {Object.keys(adviceCategories).map(category => (
            <button
              key={category}
              className={`category-tab ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              <span className="category-icon">{getCategoryIcon(category)}</span>
              <span className="category-name">{getCategoryLabel(category)}</span>
              <span className="category-count">{adviceCategories[category].length}</span>
            </button>
          ))}
        </div>
        
        <div className="advice-search">
          <input
            type="text"
            placeholder={`Search in ${getCategoryLabel(activeCategory)}...`}
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      
      <div className="advice-content">
        <h3>{getCategoryLabel(activeCategory)}</h3>
        
        {filteredAdvice.length > 0 ? (
          <div className="advice-list">
            {filteredAdvice.map((advice, index) => (
              <div key={index} className="advice-item">
                <div className="advice-text">
                  <span className="advice-icon">{getCategoryIcon(activeCategory)}</span>
                  {advice.text}
                </div>
                
                <div className="advice-meta">
                  <span className="occurrence-count">
                    Suggested {advice.occurrences.length} {advice.occurrences.length === 1 ? 'time' : 'times'}
                  </span>
                  <span className="last-occurrence">
                    Last: {formatDate(advice.occurrences[0].date)}
                  </span>
                </div>
                
                <div className="advice-conditions">
                  {getUniqueConditions(advice.occurrences).slice(0, 3).map((condition, idx) => (
                    <span key={idx} className="condition-tag small">
                      {condition.name}
                    </span>
                  ))}
                  {getUniqueConditions(advice.occurrences).length > 3 && (
                    <span className="more-tag">
                      +{getUniqueConditions(advice.occurrences).length - 3}
                    </span>
                  )}
                </div>
                
                <div className="advice-links">
                  <div className="related-sessions">
                    Related sessions:
                    {advice.occurrences.slice(0, 2).map((occurrence, occIdx) => (
                      <Link 
                        key={occIdx}
                        to={`/chat/${occurrence.sessionId}`}
                        className="session-link"
                      >
                        {formatDate(occurrence.date)}
                      </Link>
                    ))}
                    {advice.occurrences.length > 2 && (
                      <span className="more-sessions">
                        +{advice.occurrences.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-advice">
            <p>
              {searchTerm.trim()
                ? `No ${getCategoryLabel(activeCategory).toLowerCase()} match your search criteria.`
                : `No ${getCategoryLabel(activeCategory).toLowerCase()} have been suggested yet.`}
            </p>
            {!searchTerm.trim() && adviceCategories.homeCare.length === 0 && (
              <Link to="/chat" className="start-chat-btn">
                Start a Consultation
              </Link>
            )}
          </div>
        )}
      </div>
      
      <div className="advice-disclaimer">
        <p>
          These suggestions are based on your chat interactions and are not professional medical advice. 
          Always consult with a healthcare provider for proper medical guidance.
        </p>
      </div>
    </div>
  );
};

// Helper function to get unique conditions from occurrences
const getUniqueConditions = (occurrences) => {
  const conditionMap = new Map();
  
  occurrences.forEach(occurrence => {
    if (occurrence.conditions && occurrence.conditions.length > 0) {
      occurrence.conditions.forEach(condition => {
        if (!conditionMap.has(condition.id)) {
          conditionMap.set(condition.id, condition);
        }
      });
    }
  });
  
  return Array.from(conditionMap.values());
};

export default AdviceLog;