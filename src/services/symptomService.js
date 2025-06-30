// src/services/symptomService.js

import { symptomsData } from '../utils/symptomsData';
import { conditionsData } from '../utils/conditionsData';

// This is a simplified version of symptom analysis
// In a production app, you'd use a more sophisticated NLP/ML system
export const analyzeSymptoms = async (userInput, previousMessages) => {
  // Convert input to lowercase for easier matching
  const input = userInput.toLowerCase();
  
  // Extract context from previous messages
  const context = previousMessages
    .filter(msg => msg.sender === 'user')
    .map(msg => msg.text)
    .join(' ')
    .toLowerCase();
  
  // Check for symptoms in the user input
  const detectedSymptoms = symptomsData.filter(symptom => 
    input.includes(symptom.keyword) || context.includes(symptom.keyword)
  );
  
  // If no symptoms detected, ask for more information
  if (detectedSymptoms.length === 0) {
    return {
      message: "I couldn't identify specific symptoms. Could you provide more details about how you're feeling?",
      suggestions: [
        "Do you have any pain?",
        "Are you experiencing fever or chills?",
        "How long have you been feeling this way?"
      ]
    };
  }
  
  // Check if we need more specific information
  const needMoreInfo = detectedSymptoms.some(symptom => symptom.needsFollowUp);
  
  if (needMoreInfo && !hasFollowUpInfo(input, context)) {
    const symptom = detectedSymptoms.find(s => s.needsFollowUp);
    return {
      message: symptom.followUpQuestion,
      suggestions: symptom.suggestedResponses
    };
  }
  
  // Match symptoms to potential conditions
  const potentialConditions = matchConditions(detectedSymptoms, input, context);
  
  if (potentialConditions.length === 0) {
    return {
      message: "Based on the information provided, I can't determine a specific condition. It would be best to consult with a healthcare professional for a proper diagnosis.",
      suggestions: [
        "Would you like general health advice?",
        "Do you have any other symptoms?"
      ]
    };
  }
  
  // Sort conditions by match score
  const topCondition = potentialConditions[0];
  
  // Generate response based on condition
  const response = {
    message: `Based on your symptoms, you might be experiencing ${topCondition.name}. ${topCondition.description}`,
    suggestions: topCondition.advice,
    conditions: [topCondition]
  };
  // Continuing src/services/symptomService.js

  // Add severity information and medical advice
  if (topCondition.severity === 'High') {
    response.message += " This appears to be a condition that requires medical attention. Please consider consulting a healthcare provider soon.";
  } else if (topCondition.severity === 'Medium') {
    response.message += " Monitor your symptoms closely. If they worsen or persist for more than a few days, you should consult a healthcare provider.";
  } else {
    response.message += " This is generally a mild condition that can often be managed with self-care, but consult a healthcare provider if symptoms worsen.";
  }
  
  return response;
};

// Helper function to check if user has provided follow-up information
const hasFollowUpInfo = (input, context) => {
  const durationTerms = ['days', 'weeks', 'hours', 'months', 'year', 'yesterday', 'today'];
  const intensityTerms = ['mild', 'severe', 'moderate', 'intense', 'unbearable', 'slight'];
  
  // Check for duration information
  const hasDuration = durationTerms.some(term => input.includes(term) || context.includes(term));
  
  // Check for intensity information
  const hasIntensity = intensityTerms.some(term => input.includes(term) || context.includes(term));
  
  return hasDuration || hasIntensity;
};

// Match symptoms to conditions
const matchConditions = (symptoms, input, context) => {
  const matchedConditions = [];
  
  for (const condition of conditionsData) {
    let matchScore = 0;
    let matchedSymptomCount = 0;
    
    // Calculate match score based on symptoms
    for (const symptom of symptoms) {
      if (condition.symptoms.includes(symptom.keyword)) {
        matchScore += 2;
        matchedSymptomCount++;
      }
    }
    
    // Additional context matching
    for (const keyword of condition.relatedKeywords || []) {
      if (input.includes(keyword) || context.includes(keyword)) {
        matchScore += 1;
      }
    }
    
    // Only consider conditions that match at least one symptom
    if (matchedSymptomCount > 0) {
      matchedConditions.push({
        ...condition,
        matchScore
      });
    }
  }
  
  // Sort by match score (highest first)
  return matchedConditions.sort((a, b) => b.matchScore - a.matchScore);
};