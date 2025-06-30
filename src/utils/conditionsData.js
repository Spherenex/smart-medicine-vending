// src/utils/conditionsData.js

export const conditionsData = [
  {
    name: "Common Cold",
    symptoms: ["runny nose", "sore throat", "cough", "headache", "fatigue"],
    description: "The common cold is a viral infection of the upper respiratory tract.",
    advice: [
      "Rest and stay hydrated",
      // Continuing src/utils/conditionsData.js
      "Take over-the-counter pain relievers if needed",
      "Use a humidifier or take a hot shower to ease congestion",
      "Gargle with salt water for a sore throat"
    ],
    severity: "Low",
    relatedKeywords: ["congestion", "sneezing", "stuffy"]
  },
  {
    name: "Influenza (Flu)",
    symptoms: ["fever", "fatigue", "cough", "headache", "body aches"],
    description: "Influenza is a viral infection that attacks your respiratory system.",
    advice: [
      "Rest and stay hydrated",
      "Take over-the-counter fever reducers and pain relievers",
      "Stay home to avoid spreading the infection",
      "Contact a healthcare provider if symptoms are severe or you're in a high-risk group"
    ],
    severity: "Medium",
    relatedKeywords: ["chills", "sweating", "weakness"]
  },
  {
    name: "Migraine",
    symptoms: ["headache", "nausea", "dizzy"],
    description: "Migraines are severe, recurring headaches that can cause throbbing pain often on one side of the head.",
    advice: [
      "Rest in a quiet, dark room",
      "Apply cold compresses to your forehead",
      "Take over-the-counter pain relievers",
      "Stay hydrated",
      "If frequent or severe, consult a doctor for preventive medications"
    ],
    severity: "Medium",
    relatedKeywords: ["visual disturbances", "aura", "sensitivity to light", "vomiting"]
  },
  {
    name: "Gastroenteritis (Stomach Flu)",
    symptoms: ["nausea", "stomach pain", "fatigue"],
    description: "Gastroenteritis is an inflammation of the digestive tract, particularly the stomach and intestines.",
    advice: [
      "Stay hydrated with small sips of water or electrolyte drinks",
      "Eat bland foods once able to eat",
      "Rest and avoid dairy, caffeine, and spicy foods",
      "Seek medical help if unable to keep fluids down or experiencing severe symptoms"
    ],
    severity: "Medium",
    relatedKeywords: ["diarrhea", "vomiting", "cramps"]
  },
  {
    name: "Tension Headache",
    symptoms: ["headache", "fatigue"],
    description: "Tension headaches are the most common type of headache, often described as a feeling of pressure or tightness.",
    advice: [
      "Take over-the-counter pain relievers",
      "Practice stress management and relaxation techniques",
      "Apply a warm or cool compress to your head",
      "Maintain regular sleep patterns and stay hydrated"
    ],
    severity: "Low",
    relatedKeywords: ["stress", "neck pain", "pressure"]
  },
  {
    name: "Hypertension (High Blood Pressure)",
    symptoms: ["headache", "dizzy", "fatigue"],
    description: "Hypertension is a condition in which the force of the blood against the artery walls is too high.",
    advice: [
      "Monitor your blood pressure regularly",
      "Reduce sodium in your diet",
      "Exercise regularly",
      "Limit alcohol and quit smoking if applicable",
      "Consult a healthcare provider for proper management"
    ],
    severity: "High",
    relatedKeywords: ["blood pressure", "chest pain"]
  },
  {
    name: "Allergic Reaction",
    symptoms: ["rash", "runny nose", "headache"],
    description: "An allergic reaction occurs when your immune system reacts to a foreign substance.",
    advice: [
      "Avoid known allergens",
      "Take antihistamines for mild symptoms",
      "Apply hydrocortisone cream for skin reactions",
      "Seek immediate medical attention for severe reactions or difficulty breathing"
    ],
    severity: "Medium",
    relatedKeywords: ["itching", "swelling", "hives"]
  },
  {
    name: "Appendicitis",
    symptoms: ["stomach pain", "nausea", "fever"],
    description: "Appendicitis is an inflammation of the appendix that can cause severe pain.",
    advice: [
      "Seek immediate medical attention",
      "Do not eat or drink anything until seeing a doctor",
      "Do not take pain medications as they may mask symptoms",
      "This is a medical emergency that typically requires surgery"
    ],
    severity: "High",
    relatedKeywords: ["right lower abdomen", "sharp pain", "rebound tenderness"]
  }
];