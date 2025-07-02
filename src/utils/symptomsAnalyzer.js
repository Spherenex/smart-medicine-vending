// src/utils/symptomsAnalyzer.js

// List of common symptoms for keyword matching
const commonSymptoms = [
  'fever', 'cough', 'headache', 'sore throat', 'runny nose', 'stuffy nose', 
  'fatigue', 'tiredness', 'muscle ache', 'joint pain', 'back pain', 'nausea', 
  'vomiting', 'diarrhea', 'constipation', 'dizziness', 'shortness of breath', 
  'chest pain', 'abdominal pain', 'stomach pain', 'rash', 'itching', 'swelling', 
  'sneezing', 'wheezing', 'chills', 'sweating', 'loss of appetite', 'weight loss', 
  'weight gain', 'insomnia', 'drowsiness', 'blurred vision', 'dry mouth', 'difficulty swallowing',
  'ear pain', 'tinnitus', 'hearing loss', 'sinus pressure', 'nasal congestion',
  'heartburn', 'indigestion', 'bloating', 'gas', 'anxiety', 'depression', 'mood swings'
];

// Symptom severity indicators
const severityIndicators = [
  'mild', 'moderate', 'severe', 'intense', 'slight', 'extreme', 'unbearable',
  'excruciating', 'debilitating', 'overwhelming', 'sharp', 'dull', 'throbbing',
  'shooting', 'stabbing', 'burning', 'crushing', 'splitting', 'radiating'
];

// Duration indicators
const durationIndicators = [
  'days', 'day', 'weeks', 'week', 'months', 'month', 'years', 'year',
  'hours', 'hour', 'minutes', 'minute', 'seconds', 'second',
  'chronic', 'acute', 'persistent', 'recurring', 'intermittent', 'constant'
];

// Analyze text to extract symptoms
export const analyzeSymptoms = async (text) => {
  try {
    // Convert text to lowercase for case-insensitive matching
    const lowerText = text.toLowerCase();
    
    // Extract symptoms
    const extractedSymptoms = [];
    
    // Check for common symptoms
    for (const symptom of commonSymptoms) {
      if (lowerText.includes(symptom)) {
        extractedSymptoms.push(symptom);
      }
    }
    
    // In a real-world implementation, we would use NLP to better understand context,
    // negations (e.g., "I don't have a fever"), temporal information, etc.
    
    return extractedSymptoms;
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    return [];
  }
};

// Extract severity of symptoms
export const extractSeverity = (text) => {
  const lowerText = text.toLowerCase();
  const severity = {};
  
  for (const symptom of commonSymptoms) {
    if (lowerText.includes(symptom)) {
      // Look for severity indicators near the symptom
      const words = lowerText.split(/\s+/);
      const symptomIndex = words.findIndex(word => word.includes(symptom));
      
      if (symptomIndex !== -1) {
        // Check 3 words before and after for severity indicators
        const context = words.slice(Math.max(0, symptomIndex - 3), symptomIndex + 4);
        
        for (const indicator of severityIndicators) {
          if (context.includes(indicator)) {
            severity[symptom] = indicator;
            break;
          }
        }
        
        // If no severity found, default to 'moderate'
        if (!severity[symptom]) {
          severity[symptom] = 'moderate';
        }
      }
    }
  }
  
  return severity;
};

// Extract duration of symptoms
export const extractDuration = (text) => {
  const lowerText = text.toLowerCase();
  const duration = {};
  
  for (const symptom of commonSymptoms) {
    if (lowerText.includes(symptom)) {
      // Look for duration indicators near the symptom
      const symptomIndex = lowerText.indexOf(symptom);
      const contextStart = Math.max(0, symptomIndex - 50);
      const contextEnd = Math.min(lowerText.length, symptomIndex + 50);
      const context = lowerText.substring(contextStart, contextEnd);
      
      // Check for duration patterns like "for 2 days" or "since last week"
      for (const indicator of durationIndicators) {
        if (context.includes(indicator)) {
          // Try to extract numeric value if present
          const regex = new RegExp(`(\\d+)\\s+${indicator}`, 'i');
          const match = context.match(regex);
          
          if (match) {
            duration[symptom] = `${match[1]} ${indicator}`;
          } else if (context.includes(`a ${indicator}`) || context.includes(`an ${indicator}`)) {
            duration[symptom] = `1 ${indicator}`;
          } else {
            duration[symptom] = indicator;
          }
          
          break;
        }
      }
      
      // If no duration found, set to 'unknown'
      if (!duration[symptom]) {
        duration[symptom] = 'unknown';
      }
    }
  }
  
  return duration;
};

// Analyze symptom combination for potential urgency
export const analyzeUrgency = (symptoms, severity = {}, duration = {}) => {
  // High urgency symptom combinations
  const highUrgencyCombinations = [
    ['chest pain', 'shortness of breath'],
    ['fever', 'stiff neck'],
    ['severe headache', 'blurred vision'],
    ['difficulty breathing', 'wheezing'],
    ['severe abdominal pain', 'vomiting']
  ];
  
  // Check if any high urgency combination exists
  for (const combination of highUrgencyCombinations) {
    if (combination.every(symptom => symptoms.includes(symptom))) {
      return 'high';
    }
  }
  
  // Check for severe symptoms
  for (const symptom of symptoms) {
    if (severity[symptom] === 'severe' || 
        severity[symptom] === 'extreme' || 
        severity[symptom] === 'unbearable' ||
        severity[symptom] === 'excruciating') {
      return 'medium';
    }
  }
  
  // Default to low urgency
  return 'low';
};

// Export all functions
export default {
  analyzeSymptoms,
  extractSeverity,
  extractDuration,
  analyzeUrgency
};