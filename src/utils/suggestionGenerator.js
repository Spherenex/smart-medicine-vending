// src/utils/suggestionGenerator.js
import { getConditionDetails, getUrgencyLevel } from './conditionMatcher';

// Generate suggestions based on detected conditions
export const generateSuggestions = async (detectedConditions) => {
  try {
    if (!detectedConditions || detectedConditions.length === 0) {
      return {
        homeCare: [
          "Rest and stay hydrated",
          "Monitor your symptoms"
        ],
        actionPlan: [
          "Consider consulting a healthcare provider if symptoms persist or worsen"
        ],
        alertLevel: "low",
        preventiveTips: [
          "Maintain a balanced diet",
          "Get regular exercise",
          "Ensure adequate sleep"
        ]
      };
    }
    
    // Generate suggestions based on the most likely condition
    const topCondition = detectedConditions[0];
    const conditionDetails = getConditionDetails(topCondition.id);
    
    // Determine overall urgency level
    const urgencyLevel = getUrgencyLevel(detectedConditions);
    
    // Generate suggestions based on the condition and urgency
    return {
      homeCare: generateHomeCare(conditionDetails),
      actionPlan: generateActionPlan(conditionDetails, urgencyLevel),
      alertLevel: urgencyLevel,
      preventiveTips: generatePreventiveTips(conditionDetails)
    };
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return {
      homeCare: [],
      actionPlan: [],
      alertLevel: "low",
      preventiveTips: []
    };
  }
};

// Generate home care tips based on condition
const generateHomeCare = (condition) => {
  const generalTips = [
    "Rest and stay hydrated",
    "Take over-the-counter pain relievers if needed",
    "Monitor your symptoms"
  ];
  
  if (!condition) {
    return generalTips;
  }
  
  // Condition-specific home care tips
  const conditionTips = {
    common_cold: [
      "Get plenty of rest",
      "Stay hydrated with water, tea, or clear broths",
      "Use a humidifier or take steamy showers to ease congestion",
      "Try over-the-counter cold medications to relieve symptoms",
      "Gargle with salt water to soothe a sore throat"
    ],
    flu: [
      "Rest and avoid physical exertion",
      "Stay hydrated with water, sports drinks, or broth",
      "Take acetaminophen or ibuprofen to reduce fever and relieve pain",
      "Use a humidifier to ease breathing",
      "Wear lightweight clothing and keep room temperature comfortable"
    ],
    seasonal_allergies: [
      "Avoid known allergens when possible",
      "Try over-the-counter antihistamines",
      "Use a saline nasal spray to rinse allergens",
      "Keep windows closed during high pollen days",
      "Shower after being outdoors to remove allergens"
    ],
    migraine: [
      "Rest in a quiet, dark room",
      "Apply cold or warm compresses to your head",
      "Try over-the-counter pain relievers",
      "Stay hydrated and maintain regular meals",
      "Practice relaxation techniques"
    ],
    food_poisoning: [
      "Stay hydrated with small sips of water or clear fluids",
      "Avoid solid foods until vomiting stops",
      "Gradually reintroduce bland foods like toast and rice",
      "Avoid dairy, caffeine, alcohol, and fatty foods",
      "Get plenty of rest"
    ],
    strep_throat: [
      "Rest your voice and get plenty of sleep",
      "Drink warm liquids like tea with honey",
      "Gargle with salt water several times a day",
      "Use throat lozenges to soothe pain",
      "Take over-the-counter pain relievers"
    ],
    anxiety: [
      "Practice deep breathing exercises",
      "Try progressive muscle relaxation",
      "Maintain a regular sleep schedule",
      "Limit caffeine and alcohol",
      "Engage in physical activity"
    ],
    heart_attack: [
      "Seek emergency medical help immediately",
      "Chew aspirin if advised by medical professionals",
      "Rest in a position that makes breathing comfortable",
      "Loosen tight clothing"
    ],
    dehydration: [
      "Sip water or oral rehydration solutions",
      "Avoid caffeine and alcohol",
      "Eat foods with high water content",
      "Stay cool and out of the sun",
      "Rest and avoid strenuous activity"
    ]
  };
  
  return conditionTips[condition.id] || generalTips;
};

// Generate action plan based on condition and urgency
const generateActionPlan = (condition, urgencyLevel) => {
  if (!condition) {
    return ["Monitor your symptoms and consult a healthcare provider if they worsen"];
  }
  
  // Urgency-based action plans
  if (urgencyLevel === 'high') {
    return [
      "Seek immediate medical attention or call emergency services",
      "Do not attempt to drive yourself to the hospital",
      "Inform medical professionals about all your symptoms"
    ];
  }
  
  if (urgencyLevel === 'medium') {
    return [
      "Schedule an appointment with your healthcare provider within 24-48 hours",
      "Monitor your symptoms closely for any worsening",
      "Follow the home care recommendations while waiting for your appointment"
    ];
  }
  
  // Condition-specific action plans for low urgency
  const conditionPlans = {
    common_cold: [
      "Monitor your symptoms for 7-10 days",
      "Consult a healthcare provider if symptoms last more than 10 days",
      "Seek medical attention if you develop high fever, severe headache, or difficulty breathing"
    ],
    seasonal_allergies: [
      "Consider over-the-counter antihistamines",
      "Consult an allergist if symptoms are severe or persistent",
      "Keep track of triggers that worsen your symptoms"
    ],
    anxiety: [
      "Consider speaking with a mental health professional",
      "Look into meditation or mindfulness apps",
      "Establish a regular exercise routine"
    ]
  };
  
  return conditionPlans[condition.id] || [
    "Monitor your symptoms for a few days",
    "Consult a healthcare provider if symptoms persist or worsen",
    "Follow the home care recommendations"
  ];
};

// Generate preventive tips based on condition
const generatePreventiveTips = (condition) => {
  const generalTips = [
    "Wash hands frequently",
    "Maintain a balanced diet",
    "Get regular exercise",
    "Ensure adequate sleep",
    "Stay hydrated"
  ];
  
  if (!condition) {
    return generalTips;
  }
  
  // Condition-specific preventive tips
  const conditionTips = {
    common_cold: [
      "Wash hands frequently",
      "Avoid close contact with sick individuals",
      "Don't touch your face with unwashed hands",
      "Keep your immune system strong with a healthy diet",
      "Get adequate sleep"
    ],
    flu: [
      "Get an annual flu vaccine",
      "Wash hands frequently",
      "Avoid close contact with sick individuals",
      "Maintain a healthy lifestyle to support immune function",
      "Clean and disinfect frequently touched surfaces"
    ],
    seasonal_allergies: [
      "Monitor pollen counts and stay indoors when high",
      "Use air purifiers in your home",
      "Wear sunglasses outdoors to protect eyes from allergens",
      "Shower after being outdoors to remove allergens",
      "Consider allergy testing to identify specific triggers"
    ],
    migraine: [
      "Identify and avoid personal triggers",
      "Maintain a regular sleep schedule",
      "Stay hydrated and don't skip meals",
      "Manage stress through relaxation techniques",
      "Keep a headache diary to track patterns"
    ],
    food_poisoning: [
      "Wash hands and surfaces before preparing food",
      "Separate raw and cooked foods",
      "Cook foods to proper temperatures",
      "Refrigerate perishable foods promptly",
      "Be cautious when eating out, especially with raw foods"
    ],
    strep_throat: [
      "Avoid sharing personal items like utensils or drinks",
      "Wash hands frequently",
      "Replace your toothbrush after being sick",
      "Avoid close contact with infected individuals",
      "Complete the full course of antibiotics if prescribed"
    ],
    anxiety: [
      "Practice regular relaxation techniques",
      "Maintain a healthy lifestyle with regular exercise",
      "Limit caffeine and alcohol",
      "Prioritize sleep hygiene",
      "Consider therapy or counseling for ongoing management"
    ],
    heart_attack: [
      "Maintain a heart-healthy diet low in saturated fat and sodium",
      "Exercise regularly as advised by your doctor",
      "Manage stress through healthy coping mechanisms",
      "Don't smoke and avoid secondhand smoke",
      "Take medications as prescribed for conditions like high blood pressure"
    ],
    dehydration: [
      "Drink water throughout the day, not just when thirsty",
      "Increase fluid intake during hot weather or exercise",
      "Limit alcohol and caffeine consumption",
      "Eat fruits and vegetables with high water content",
      "Be aware of early signs of dehydration"
    ]
  };
  
  return conditionTips[condition.id] || generalTips;
};

// Export all functions
export default {
  generateSuggestions,
  generateHomeCare,
  generateActionPlan,
  generatePreventiveTips
};