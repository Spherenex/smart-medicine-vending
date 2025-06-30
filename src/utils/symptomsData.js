// src/utils/symptomsData.js

export const symptomsData = [
  {
    keyword: "headache",
    followUpQuestion: "Can you describe your headache? How long have you had it?",
    suggestedResponses: [
      "It's a throbbing pain",
      "It's a dull, constant pain",
      "It's been ongoing for days",
      "It just started recently"
    ],
    needsFollowUp: true
  },
  {
    keyword: "fever",
    followUpQuestion: "How high is your fever and when did it start?",
    suggestedResponses: [
      "Low fever (below 100.4°F/38°C)",
      "High fever (above 100.4°F/38°C)",
      "Started today",
      "Started a few days ago"
    ],
    needsFollowUp: true
  },
  {
    keyword: "cough",
    followUpQuestion: "Is your cough dry or producing phlegm? How long have you been coughing?",
    suggestedResponses: [
      "Dry cough",
      "Cough with phlegm",
      "Been coughing for days",
      "Just started coughing"
    ],
    needsFollowUp: true
  },
  {
    keyword: "stomach pain",
    followUpQuestion: "Where exactly is the pain and is it constant or intermittent?",
    suggestedResponses: [
      "Upper abdomen pain",
      "Lower abdomen pain",
      "Constant pain",
      "Comes and goes"
    ],
    needsFollowUp: true
  },
  {
    keyword: "fatigue",
    needsFollowUp: false
  },
  {
    keyword: "sore throat",
    needsFollowUp: false
  },
  {
    keyword: "runny nose",
    needsFollowUp: false
  },
  {
    keyword: "nausea",
    needsFollowUp: false
  },
  {
    keyword: "dizzy",
    followUpQuestion: "When do you feel dizzy and does anything make it better or worse?",
    suggestedResponses: [
      "When standing up",
      "All the time",
      "When moving my head",
      "Comes with headaches"
    ],
    needsFollowUp: true
  },
  {
    keyword: "rash",
    followUpQuestion: "Where is the rash located and what does it look like?",
    suggestedResponses: [
      "Itchy red bumps",
      "Flat red areas",
      "On my face/neck",
      "On my body/limbs"
    ],
    needsFollowUp: true
  }
];