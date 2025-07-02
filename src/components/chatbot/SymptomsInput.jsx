// src/components/chatbot/SymptomsInput.jsx
import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { addChatMessage } from '../../services/chatService';
import '../../styles/chatbot.css';

const SymptomsInput = ({ sessionId, detectedSymptoms, detectedConditions, suggestions }) => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState('symptoms');
  
  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  
  // Handle updating a symptom (e.g., severity, duration)
  const handleUpdateSymptom = async (symptom, updates) => {
    try {
      // In a real app, we would update the symptom details in Firestore
      // For simplicity, we'll just log it here
      console.log(`Updating symptom ${symptom} with:`, updates);
      
      // Inform the chatbot about the update
      await addChatMessage(
        sessionId, 
        `I'd like to provide more details about my ${symptom}: ${JSON.stringify(updates)}`,
        true
      );
    } catch (error) {
      console.error('Error updating symptom:', error);
    }
  };
  
  // Handle removing a symptom
  const handleRemoveSymptom = async (symptom) => {
    try {
      // Filter out the symptom from the array
      const updatedSymptoms = detectedSymptoms.filter(s => s !== symptom);
      
      // Update in Firestore
      const sessionRef = doc(db, 'chatSessions', sessionId);
      await updateDoc(sessionRef, {
        symptoms: updatedSymptoms
      });
      
      // Inform the chatbot about the removal
      await addChatMessage(
        sessionId, 
        `I don't actually have ${symptom} as a symptom.`,
        true
      );
    } catch (error) {
      console.error('Error removing symptom:', error);
    }
  };
  
  // Handle adding a new symptom manually
  const handleAddSymptom = async (e) => {
    e.preventDefault();
    const newSymptom = e.target.symptom.value.trim().toLowerCase();
    
    if (!newSymptom) return;
    
    try {
      // Check if symptom already exists
      if (detectedSymptoms.includes(newSymptom)) {
        alert('This symptom is already in your list.');
        return;
      }
      
      // Add to Firestore
      const updatedSymptoms = [...detectedSymptoms, newSymptom];
      const sessionRef = doc(db, 'chatSessions', sessionId);
      
      await updateDoc(sessionRef, {
        symptoms: updatedSymptoms
      });
      
      // Inform the chatbot
      await addChatMessage(
        sessionId, 
        `I also have ${newSymptom} as a symptom.`,
        true
      );
      
      // Clear form
      e.target.reset();
    } catch (error) {
      console.error('Error adding symptom:', error);
    }
  };
  
  // Get alert level color
  const getAlertColor = (alertLevel) => {
    switch (alertLevel) {
      case 'high':
        return '#ff4d4d';
      case 'medium':
        return '#ffcc00';
      case 'low':
        return '#4CAF50';
      default:
        return '#4CAF50';
    }
  };
  
  if (!showSidebar) {
    return (
      <div className="symptoms-toggle-collapsed">
        <button onClick={toggleSidebar}>
          &gt; Show Health Info
        </button>
      </div>
    );
  }
  
  return (
    <div className="symptoms-sidebar">
      <div className="symptoms-header">
        <h3>Health Information</h3>
        <button className="toggle-button" onClick={toggleSidebar}>
          &lt; Hide
        </button>
      </div>
      
      <div className="symptoms-tabs">
        <button 
          className={`tab ${activeTab === 'symptoms' ? 'active' : ''}`}
          onClick={() => setActiveTab('symptoms')}
        >
          Symptoms
        </button>
        <button 
          className={`tab ${activeTab === 'conditions' ? 'active' : ''}`}
          onClick={() => setActiveTab('conditions')}
        >
          Possible Conditions
        </button>
        <button 
          className={`tab ${activeTab === 'suggestions' ? 'active' : ''}`}
          onClick={() => setActiveTab('suggestions')}
        >
          Suggestions
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'symptoms' && (
          <div className="symptoms-list">
            <h4>Detected Symptoms</h4>
            {detectedSymptoms.length > 0 ? (
              <ul>
                {detectedSymptoms.map((symptom, index) => (
                  <li key={index} className="symptom-item">
                    <span className="symptom-name">{symptom}</span>
                    <div className="symptom-actions">
                      <button 
                        className="symptom-action-btn edit"
                        onClick={() => handleUpdateSymptom(symptom, { severity: 'moderate' })}
                        title="Edit details"
                      >
                        ✏️
                      </button>
                      <button 
                        className="symptom-action-btn delete"
                        onClick={() => handleRemoveSymptom(symptom)}
                        title="Remove symptom"
                      >
                        ❌
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No symptoms detected yet. Please describe your symptoms in the chat.</p>
            )}
            
            <form onSubmit={handleAddSymptom} className="add-symptom-form">
              <input 
                type="text" 
                name="symptom" 
                placeholder="Add a symptom manually..." 
                required 
              />
              <button type="submit">Add</button>
            </form>
          </div>
        )}
        
        {activeTab === 'conditions' && (
          <div className="conditions-list">
            <h4>Possible Conditions</h4>
            {detectedConditions && detectedConditions.length > 0 ? (
              <ul>
                {detectedConditions.map((condition, index) => (
                  <li key={index} className="condition-item">
                    <div className="condition-header">
                      <span className="condition-name">{condition.name}</span>
                      <span 
                        className="condition-match" 
                        title="Match confidence"
                      >
                        {Math.round(condition.matchPercentage * 100)}%
                      </span>
                    </div>
                    <div 
                      className="condition-urgency"
                      style={{ backgroundColor: getAlertColor(condition.urgency) }}
                    >
                      {condition.urgency.toUpperCase()} urgency
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No conditions detected yet. Please provide more symptom information.</p>
            )}
            <div className="disclaimer">
              Note: These are not diagnoses. Please consult a healthcare professional for proper medical advice.
            </div>
          </div>
        )}
        
        {activeTab === 'suggestions' && (
          <div className="suggestions-list">
            <h4>Suggestions</h4>
            {suggestions && Object.keys(suggestions).length > 0 ? (
              <div>
                {suggestions.alertLevel && (
                  <div 
                    className="alert-level"
                    style={{ backgroundColor: getAlertColor(suggestions.alertLevel) }}
                  >
                    Alert Level: {suggestions.alertLevel.toUpperCase()}
                  </div>
                )}
                
                {suggestions.homeCare && suggestions.homeCare.length > 0 && (
                  <div className="suggestion-section">
                    <h5>Home Care Tips</h5>
                    <ul>
                      {suggestions.homeCare.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {suggestions.actionPlan && suggestions.actionPlan.length > 0 && (
                  <div className="suggestion-section">
                    <h5>Action Plan</h5>
                    <ul>
                      {suggestions.actionPlan.map((action, index) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {suggestions.preventiveTips && suggestions.preventiveTips.length > 0 && (
                  <div className="suggestion-section">
                    <h5>Preventive Tips</h5>
                    <ul>
                      {suggestions.preventiveTips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p>No suggestions available yet. Please provide more symptom information.</p>
            )}
            <div className="disclaimer">
              Note: These suggestions are general guidelines. Please consult a healthcare professional for proper medical advice.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomsInput;