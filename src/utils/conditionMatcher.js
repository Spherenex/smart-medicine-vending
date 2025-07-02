// src/utils/conditionMatcher.js

// Database of common conditions and their associated symptoms
// In a real application, this would be much more comprehensive and likely stored in Firestore
const conditionsDatabase = [
  {
    id: 'common_cold',
    name: 'Common Cold',
    symptoms: ['runny nose', 'sore throat', 'cough', 'sneezing', 'congestion', 'stuffy nose'],
    urgency: 'low'
  },
  {
    id: 'flu',
    name: 'Influenza (Flu)',
    symptoms: ['fever', 'cough', 'sore throat', 'fatigue', 'muscle ache', 'headache', 'chills'],
    urgency: 'medium'
  },
  {
    id: 'seasonal_allergies',
    name: 'Seasonal Allergies',
    symptoms: ['sneezing', 'runny nose', 'itching', 'watery eyes', 'congestion', 'stuffy nose'],
    urgency: 'low'
  },
  {
    id: 'migraine',
    name: 'Migraine',
    symptoms: ['headache', 'nausea', 'sensitivity to light', 'blurred vision', 'dizziness'],
    urgency: 'medium'
  },
  {
    id: 'food_poisoning',
    name: 'Food Poisoning',
    symptoms: ['nausea', 'vomiting', 'diarrhea', 'abdominal pain', 'stomach pain', 'fever', 'chills'],
    urgency: 'medium'
  },
  {
    id: 'strep_throat',
    name: 'Strep Throat',
    symptoms: ['sore throat', 'fever', 'swollen lymph nodes', 'difficulty swallowing', 'headache'],
    urgency: 'medium'
  },
  {
    id: 'anxiety',
    name: 'Anxiety',
    symptoms: ['anxiety', 'rapid heartbeat', 'sweating', 'shortness of breath', 'dizziness', 'nausea'],
    urgency: 'medium'
  },
  {
    id: 'heart_attack',
    name: 'Heart Attack',
    symptoms: ['chest pain', 'shortness of breath', 'pain in arm', 'sweating', 'nausea', 'dizziness'],
    urgency: 'high'
  },
  {
    id: 'dehydration',
    name: 'Dehydration',
    symptoms: ['thirst', 'dry mouth', 'fatigue', 'dizziness', 'headache', 'decreased urination'],
    urgency: 'medium'
  }
];

// Match symptoms to potential conditions
export const matchConditions = async (symptoms) => {
  try {
    // Convert symptoms to lowercase for matching
    const normalizedSymptoms = symptoms.map(s => s.toLowerCase());
    
    // Calculate match scores for each condition
    const conditionScores = conditionsDatabase.map(condition => {
      // Count how many symptoms match
      const matchingSymptoms = condition.symptoms.filter(symptom => 
        normalizedSymptoms.includes(symptom)
      );
      
      // Calculate match percentage (matching symptoms / total condition symptoms)
      const matchPercentage = matchingSymptoms.length / condition.symptoms.length;
      
      return {
        id: condition.id,
        name: condition.name,
        matchPercentage,
        matchingSymptomCount: matchingSymptoms.length,
        urgency: condition.urgency
      };
    });
    
    // Filter conditions with at least 40% match or at least 2 matching symptoms
    const potentialConditions = conditionScores.filter(condition => 
      condition.matchPercentage >= 0.4 || condition.matchingSymptomCount >= 2
    );
    
    // Sort by match percentage in descending order
    potentialConditions.sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    // Return top conditions (with at least some matching symptoms)
    return potentialConditions.filter(condition => condition.matchingSymptomCount > 0);
  } catch (error) {
    console.error('Error matching conditions:', error);
    return [];
  }
};

// Get condition details by ID
export const getConditionDetails = (conditionId) => {
  return conditionsDatabase.find(condition => condition.id === conditionId);
};

// Get urgency level for a set of conditions
export const getUrgencyLevel = (conditions) => {
  if (!conditions || conditions.length === 0) {
    return 'low';
  }
  
  // If any condition has high urgency, return high
  if (conditions.some(condition => condition.urgency === 'high')) {
    return 'high';
  }
  
  // If any condition has medium urgency, return medium
  if (conditions.some(condition => condition.urgency === 'medium')) {
    return 'medium';
  }
  
  // Otherwise return low
  return 'low';
};

// Export all functions
export default {
  matchConditions,
  getConditionDetails,
  getUrgencyLevel
};